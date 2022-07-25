import {
  DynamicModule,
  Logger,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { APIConfig, DatabaseConfig } from './config/config';
import { getMongoString } from './config/config.utils';
import { AppService } from './app.service';
import { LogsMiddleware } from './logger/logs.middleware';

import * as mongoose from 'mongoose';
import { IdentityModule } from './indentity/identity.module';

import colorize = require('json-colorizer');

@Module({})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }

  static register(config: APIConfig): DynamicModule {
    return {
      module: AppModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (config: ConfigService) => {
            const logger = new Logger('Mongoose');

            mongoose.set('debug', (coll, method, query, doc) => {
              logger.verbose(`${coll}.${method} ${colorize(query )} ${colorize(doc)}`);
            });

            return {
              uri: getMongoString(config.get<DatabaseConfig>('database')),
            };
          },
          inject: [ConfigService],
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          load: [() => config],
          cache: true,
        }),
        IdentityModule,
      ],
      providers: [AppService, Logger],
      controllers: [AppController],
    };
  }
}
