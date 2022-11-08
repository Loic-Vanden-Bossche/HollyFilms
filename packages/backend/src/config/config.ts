import { ConfigEnvironmentDto } from './config.environment.dto';
import { defaultConfig, Environment } from './config.default';
import { validateConfig } from 'nestjs-env-config';

export interface BaseConfig {
  port: number;
  currentEnv: Environment;
  verbose: boolean;
  whitelistedOrigins: string[];
  frontendUrl: string;
  logsPath: string;
  dataStorePath: string;
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
  medias: MediasConfig;
  googleOAuth: GoogleOAuthConfig;
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
  certPassphrase: string;
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

export interface MediasConfig {
  ffmpegPath: string;
  ffprobePath: string;
  storePathPrimary: string;
  storePathSecondary: string;
  storePathTertiary: string;
  storePathQuaternary: string;
  searchFilesPath: string;
}

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret: string;
}

export const getConfig = (env: Record<string, unknown>): APIConfig => {
  const config = validateConfig(ConfigEnvironmentDto, defaultConfig, env);

  return {
    port: config.HF_APP_PORT,
    currentEnv: config.HF_APP_ENV,
    verbose: config.HF_APP_VERBOSE,
    whitelistedOrigins: config.HF_APP_URLS_WHITELIST,
    frontendUrl: config.HF_APP_FRONTEND_URL,
    logsPath: config.HF_APP_LOGS_PATH,
    dataStorePath: config.HF_APP_DATASTORE_PATH,
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
      certPassphrase: config.HF_SSL_PASSPHRASE,
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
    medias: {
      ffmpegPath: config.HF_MEDIAS_FFMPEG_PATH,
      ffprobePath: config.HF_MEDIAS_FFPROBE_PATH,
      storePathPrimary: config.HF_MEDIAS_PATH_PRIMARY,
      storePathSecondary: config.HF_MEDIAS_PATH_SECONDARY,
      storePathTertiary: config.HF_MEDIAS_PATH_TERTIARY,
      storePathQuaternary: config.HF_MEDIAS_PATH_QUATERNARY,
      searchFilesPath: config.HF_MEDIAS_FILES_PATH,
    },
    googleOAuth: {
      clientId: config.HF_GOOGLE_AUTH_CLIENT_ID,
      clientSecret: config.HF_GOOGLE_AUTH_CLIENT_SECRET,
    },
  };
};
