import * as path from 'path';
import { Environment } from './config.default';
import { DatabaseConfig } from './config';

export const databaseUseSSL = (env: Environment): boolean => {
  return env === Environment.PROD || env === Environment.STAGING;
};

const envFiles = ['.env'];

export const getEnvFilesPaths = () => {
  const cwd = process.cwd();
  return [
    ...envFiles.map((file) => path.join(cwd, file)),
    ...envFiles.map((file) => path.join(cwd, '..', file)),
  ];
};

export const getSameSiteStrategy = (
  env: Environment,
): 'strict' | 'lax' | 'none' => {
  switch (env) {
    case Environment.PROD:
      return 'strict';
    case Environment.DEV:
      return 'lax';
    default:
      return 'none';
  }
};

const getMongoCredentials = (password: string | null, user: string | null) => {
  return password && user ? `${user}:${password}@` : '';
};

export const getMongoString = (config: DatabaseConfig): string =>
  `mongodb${
    config.port || config.host === 'localhost' ? '' : '+srv'
  }://${getMongoCredentials(config.password, config.username)}${config.host}${
    config.port ? ':' + config.port : ''
  }/${config.name || ''}?retryWrites=true&w=majority`;
