import {
  isBoolean,
  isEmail,
  isEnum,
  isNumber,
  isString,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { defaultConfig, Environment } from './config.default';
import {
  Desc,
  isPortNumber,
  isUrlArray,
  isValidPeriod,
  Secret,
  TransformArray,
  TransformBoolean,
  TransformNumber,
  UseEnvPort,
  UseDefault as BaseUseDefault,
  ConfigValidator,
} from 'nestjs-env-config';

import { ConfigValidators } from 'nestjs-env-config/dist/validator';

const UseDefault = () => BaseUseDefault(defaultConfig);

export class ConfigEnvironmentDto {
  //Base config
  @ConfigValidators(isPortNumber)
  @Expose()
  @UseDefault()
  @UseEnvPort()
  @TransformNumber()
  @Desc('Port to listen on')
  HF_APP_PORT: number;

  @ConfigValidator(isEnum, Environment)
  @Expose()
  @UseDefault()
  @Desc('Environment to run in')
  HF_APP_ENV: Environment;

  @ConfigValidators(isBoolean)
  @Expose()
  @UseDefault()
  @TransformBoolean()
  @Desc('Enable debug mode')
  HF_APP_VERBOSE: boolean;

  @ConfigValidators(isUrlArray)
  @Expose()
  @TransformArray()
  @UseDefault()
  @Desc('List of urls to proxy')
  HF_APP_URLS_WHITELIST: string[];

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Path of the frontend')
  HF_APP_FRONTEND_URL: string;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Path of the logs')
  HF_APP_LOGS_PATH: string;

  // Database
  @ConfigValidator(isString)
  @Expose()
  @UseDefault()
  @Desc('Database host')
  @Secret()
  HF_DB_HOST: string;

  @Expose()
  @UseDefault()
  @Desc('Database name')
  HF_DB_NAME: string | null;

  @Expose()
  @UseDefault()
  @Desc('Database user')
  @Secret()
  HF_DB_USER: string | null;

  @Expose()
  @UseDefault()
  @Desc('Database password')
  @Secret()
  HF_DB_PASSWORD: string | null;

  @Expose()
  @UseDefault()
  @TransformNumber()
  @Desc('Database port')
  HF_DB_PORT: number | null;

  // SSL
  @ConfigValidators(isBoolean)
  @Expose()
  @TransformBoolean()
  @UseDefault()
  @Desc('Is database ssl enabled')
  HF_SSL_ENABLED: boolean;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Database ssl key path')
  HF_SSL_KEY_PATH: string;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Database ssl cert path')
  HF_SSL_CERT_PATH: string;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Database ssl cert pass')
  HF_SSL_PASSPHRASE: string;

  // JWT
  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('JWT secret')
  @Secret()
  HF_JWT_SECRET: string;

  @ConfigValidators(isValidPeriod, isString)
  @Expose()
  @UseDefault()
  @Desc('JWT expiration time')
  HF_JWT_EXPIRE_IN: string;

  // RToken
  @ConfigValidators(isNumber)
  @Expose()
  @UseDefault()
  @TransformNumber()
  @Desc('RToken expiration time')
  HF_RTOKEN_LENGTH: number;

  @ConfigValidators(isValidPeriod, isString)
  @Expose()
  @UseDefault()
  @Desc('RToken expiration time')
  HF_RTOKEN_EXPIRE_IN: string;

  // Cookie
  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Cookie name')
  HF_COOKIE_NAME: string;

  @ConfigValidators(isValidPeriod, isString)
  @Expose()
  @UseDefault()
  @Desc('Cookie expiration time')
  HF_COOKIE_EXPIRES_IN: string;

  @ConfigValidators(isBoolean)
  @Expose()
  @TransformBoolean()
  @UseDefault()
  @Desc('Cookie secure')
  HF_COOKIE_SECURE: boolean;

  // Mails
  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Mail host')
  @Secret()
  HF_MAILS_HOST: string;

  @ConfigValidators(isEmail, isString)
  @Expose()
  @UseDefault()
  @Desc('Mail user')
  HF_MAILS_USER: string;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Mail password')
  @Secret()
  HF_MAILS_PASSWORD: string;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Mail user tag')
  HF_MAILS_USER_TAG: string;

  // Admin
  @ConfigValidators(isEmail, isString)
  @Expose()
  @UseDefault()
  @Desc('Admin email')
  HF_ADMIN_EMAIL: string;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Admin password')
  @Secret()
  HF_ADMIN_PASSWORD: string;

  // TMBD
  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('TMBD api key')
  @Secret()
  HF_TMDB_API_KEY: string;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('TMBD api url')
  HF_TMDB_API_URL: string | null;

  // Medias
  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Path of the ffmpeg executable')
  HF_MEDIAS_FFMPEG_PATH: string;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Path of the ffprobe executable')
  HF_MEDIAS_FFPROBE_PATH: string;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Path where the videos will be stored by default')
  HF_MEDIAS_PATH_DEFAULT: string;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Path where the videos will be stored in secondary')
  HF_MEDIAS_PATH_SECONDARY: string;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Path where the videos files are stored before upload')
  HF_MEDIAS_FILES_PATH: string;
}
