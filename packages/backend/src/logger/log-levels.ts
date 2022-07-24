import { Environment } from '../config/config.default';

export enum LogLevels {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  HTTP =  3,
  DEBUG = 4,
  VERBOSE = 5,
}

const productionLogLevels: LogLevels[] = [
  LogLevels.ERROR,
  LogLevels.WARN,
  LogLevels.INFO,
  LogLevels.HTTP
];

const devLogLevels: LogLevels[] = [...productionLogLevels, LogLevels.DEBUG];

const testLogLevels: LogLevels[] = [LogLevels.ERROR];

const envLogs = (env: Environment) => {
  switch (env) {
    case Environment.PROD || Environment.STAGING:
      return productionLogLevels;
    case Environment.DEV:
      return devLogLevels;
    case Environment.TEST:
      return testLogLevels;
    default:
      return devLogLevels;
  }
};

export const getLogLevels = (env: Environment, verbose = false) => [...new Set(verbose ? Object.values(LogLevels) : envLogs(env))] as LogLevels[];
