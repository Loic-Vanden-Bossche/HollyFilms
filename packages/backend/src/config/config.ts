import { ConfigEnvironmentDto } from './config.environment.dto';
import { defaultConfig, Environment } from './config.default';
import { validateConfig } from 'nestjs-env-config';

export interface BaseConfig {
  port: number;
  currentEnv: Environment;
  verbose: boolean;
  whitelistedOrigins: string[];
  frontendUrl: string;
}

export interface APIConfig extends BaseConfig {
  database: DatabaseConfig;
  ssl: SSLConfig;
  jwt: JWTConfig;
  cookie: CookieConfig;
  rToken: RTokenConfig;
  mails: MailsConfig;
  admin: AdminConfig;
  tmdb: TMDBConfig;
}

export interface CookieConfig {
  expiresIn: string;
  name: string;
  secure: boolean;
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
}

export interface SSLConfig {
  enabled: boolean;
  keyPath: string;
  certPath: string;
}

export interface DatabaseConfig {
  host: string;
  port: number | null;
  username: string | null;
  password: string | null;
  name: string | null;
}

export interface RTokenConfig {
  expiresIn: string;
  length: number;
}

export interface MailsConfig {
  host: string;
  user: string | null;
  password: string | null;
  userTag: string;
}

export interface AdminConfig {
  email: string;
  password: string;
}

export interface TMDBConfig {
  apiKey: string;
  apiUrl: string;
}

export const getConfig = (env: Record<string, unknown>): APIConfig => {
  const config = validateConfig(ConfigEnvironmentDto, defaultConfig, env);

  return {
    port: config.HF_APP_PORT,
    currentEnv: config.HF_APP_ENV,
    verbose: config.HF_APP_VERBOSE,
    whitelistedOrigins: config.HF_APP_URLS_WHITELIST,
    frontendUrl: config.HF_APP_FRONTEND_URL,
    database: {
      host: config.HF_DB_HOST,
      port: config.HF_DB_PORT,
      name: config.HF_DB_NAME,
      username: config.HF_DB_USER,
      password: config.HF_DB_PASSWORD,
    },
    ssl: {
      enabled: config.HF_SSL_ENABLED,
      keyPath: config.HF_SSL_KEY_PATH,
      certPath: config.HF_SSL_CERT_PATH,
    },
    jwt: {
      secret: config.HF_JWT_SECRET,
      expiresIn: config.HF_JWT_EXPIRE_IN,
    },
    cookie: {
      expiresIn: config.HF_COOKIE_EXPIRES_IN,
      name: config.HF_COOKIE_NAME,
      secure: config.HF_COOKIE_SECURE,
    },
    rToken: {
      expiresIn: config.HF_RTOKEN_EXPIRE_IN,
      length: config.HF_RTOKEN_LENGTH,
    },
    mails: {
      host: config.HF_MAILS_HOST,
      user: config.HF_MAILS_USER,
      password: config.HF_MAILS_PASSWORD,
      userTag: config.HF_MAILS_USER_TAG,
    },
    admin: {
      email: config.HF_ADMIN_EMAIL,
      password: config.HF_ADMIN_PASSWORD,
    },
    tmdb: {
      apiKey: config.HF_TMDB_API_KEY,
      apiUrl: config.HF_TMDB_API_URL,
    },
  };
};
