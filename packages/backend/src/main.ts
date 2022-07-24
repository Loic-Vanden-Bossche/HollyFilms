import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import { APIConfig, CookieConfig, getConfig, SSLConfig } from './config/config';
import {
  HttpException,
  Logger,
  NestApplicationOptions,
  ValidationPipe,
} from '@nestjs/common';
import fs_promise from 'fs/promises';
import { defaultConfig, Environment } from './config/config.default';
import { ConfigService } from '@nestjs/config';
import { checkOrigin } from './cors';
import helmet from 'helmet';
import { getSameSiteStrategy } from './config/config.utils';

import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as fs from 'fs';
import * as path from 'path';

import { initializeSwagger } from './swagger';
import { generateAPIDocs } from './api.doc';
import { triggerConfigDocGen } from 'nestjs-env-config';
import { ConfigEnvironmentDto } from './config/config.environment.dto';

import { getWinstonLogger } from './logger/winston';
import { UsersService } from './indentity/users/users.service';

dotenv.config({ path: '.env' });

const getSSLOptions = async (
  sslConfig: SSLConfig,
): Promise<NestApplicationOptions> => {
  if (sslConfig.enabled) {
    try {
      return {
        httpsOptions: await Promise.all([
          fs_promise.readFile(sslConfig.keyPath),
          fs_promise.readFile(sslConfig.certPath),
        ])
          .then(([key, cert]) => ({ key, cert }))
          .catch((e) => {
            throw new Error(e);
          }),
      };
    } catch (e) {
      throw new Error(
        `SSL is enabled but the key or cert files are missing ${e}`,
      );
    }
  }

  return {};
};

const loadAPIConfig = async (): Promise<{
  config: APIConfig;
  sslOptions: NestApplicationOptions;
}> => {
  const config = getConfig(process.env);
  return { config, sslOptions: await getSSLOptions(config.ssl) };
};

async function bootstrap() {
  const app = await loadAPIConfig()
    .then(({ config, sslOptions }) =>
      NestFactory.create(AppModule.register(config), {
        ...sslOptions,
        logger: getWinstonLogger(config.currentEnv),
      }),
    )
    .catch((err) => {
      console.error('Failed to load config :', err);
      process.exit(1);
    });

  const configService = app.get<ConfigService<APIConfig>>(ConfigService);
  const env = configService.get<Environment>('currentEnv');

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
          fs.writeFileSync('openapi.yaml', openapi);
          return generateAPIDocs().then((stout) => {
            logger.debug('API docs generated');
            logger.debug(stout);
          });
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

  await app.get(UsersService).createAdminAccount();

  await app.listen(configService.get<number>('port')).then(() => {
    Logger.log(
      `Server running on port ${configService.get<number>('port')}`,
      'Server',
    );
  });
}
bootstrap();
