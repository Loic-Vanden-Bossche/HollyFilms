import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { APIConfig, DatabaseConfig } from './config/config';
import { getMongoString } from './config/config.utils';
import { AppService } from './app.service';

@Module({})
export class AppModule {
  static register(config: APIConfig): DynamicModule {
    return {
      module: AppModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (config: ConfigService) => ({
            uri: getMongoString(config.get<DatabaseConfig>('database')),
          }),
          inject: [ConfigService],
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          load: [() => config],
          cache: true,
        }),
      ],
      providers: [AppService, Logger],
      controllers: [AppController],
    };
  }
}
