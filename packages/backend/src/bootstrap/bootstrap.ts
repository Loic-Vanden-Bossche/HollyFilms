import { NestFactory } from '@nestjs/core';

import * as dotenv from 'dotenv';
import { HttpException, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as fs from 'fs/promises';
import * as path from 'path';

import { triggerConfigDocGen } from 'nestjs-env-config';

import { APIConfig, CookieConfig, MediasConfig } from '../config/config';
import { AppModule } from '../app.module';
import { getWinstonLogger } from '../logger/winston';
import { defaultConfig, Environment } from '../config/config.default';
import { checkOrigin } from './cors';
import { getSameSiteStrategy } from '../config/config.utils';
import { initializeSwagger } from './swagger';
import { generateAPIDocs } from './api.doc';
import { ConfigEnvironmentDto } from '../config/config.environment.dto';
import { UsersService } from '../indentity/users/users.service';
import { warpSSLConfig } from './ssl';
import { prepareProcessing } from './prepare-processing';
import { ProcessingService } from '../processing/processing.service';

dotenv.config({ path: '.env' });

export default async () => {
  const app = await warpSSLConfig()
    .then(({ config, sslOptions }) =>
      NestFactory.create(AppModule.register(config), {
        ...sslOptions,
        logger: getWinstonLogger(
          config.currentEnv,
          config.logsPath,
          config.verbose,
          config.logglyToken,
        ),
      }),
    )
    .catch((err) => {
      console.error('Failed to load config :', err);
      process.exit(1);
    });

  const configService = app.get<ConfigService<APIConfig>>(ConfigService);
  const env = configService.get<Environment>('currentEnv');

  prepareProcessing(configService.get<MediasConfig>('medias'));

  if (env === Environment.PROD) {
    app.setGlobalPrefix('api');
  }

  app.enableCors({
    origin: (origin, callback) => {
      if (
        checkOrigin(
          env,
          origin,
          configService.get<string[]>('whitelistedOrigins'),
        )
      ) {
        Logger.verbose(`Allowed origin ${origin}`, 'CORS');
        callback(null, true);
      } else {
        Logger.verbose(`Blocked origin ${origin}`, 'CORS');
        callback(new HttpException('Not allowed by CORS', 403), false);
      }
    },
    credentials: true,
  });

  app.use(helmet({ crossOriginResourcePolicy: env === Environment.PROD }));
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        secure: configService.get<CookieConfig>('cookie').secure,
        sameSite: getSameSiteStrategy(env),
      },
      value: (req) => req.csrfToken(),
    }),
  );

  if (env !== Environment.PROD && env !== Environment.TEST) {
    const logger = new Logger('Docs');

    await initializeSwagger(app)
      .then((openapi) => {
        logger.log('Swagger initialized');

        if (env === Environment.DEV) {
          return fs.writeFile('openapi.yaml', openapi).then(() =>
            generateAPIDocs().then((stout) => {
              logger.debug('API docs generated');
              logger.debug(stout);
            }),
          );
        }
      })
      .catch((e) => {
        logger.error(e);
      });

    if (env === Environment.DEV) {
      await triggerConfigDocGen(
        ConfigEnvironmentDto,
        defaultConfig,
        'Adopte-up-prof APP environment configuration.',
        'CONFIG.md',
        path.join(process.cwd(), 'src', 'config'),
      ).then((config) => {
        if (config) {
          logger.log('Configuration doc file generated', 'Doc');
          logger.verbose(JSON.stringify(config));
        } else {
          logger.debug('Configuration doc file already up to date');
        }
      });
    }
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // await app.get(MediasService).migrateFromDatabase();
  // await app.get(UsersService).migrateFromDatabase();

  await app.get(UsersService).createAdminAccount();
  await app.get(ProcessingService).purgeProcessing();

  await app.listen(configService.get<number>('port')).then(() => {
    Logger.log(
      `Server running on port ${configService.get<number>('port')}`,
      'Server',
    );
  });
};
