import { Environment } from '../config/config.default';

const checkOrigin = (
  env: Environment,
  origin: string,
  whitelistUrls: string[],
) => {
  // On reverse proxy, the origin is not set.
  if (origin === undefined) {
    return true;
  }

  if (whitelistUrls.indexOf('all') !== -1) {
    return true;
  }

  switch (env) {
    case Environment.PROD:
      return whitelistUrls.indexOf(origin) !== -1;
    case Environment.STAGING:
      return !origin || whitelistUrls.indexOf(origin) !== -1;
    case Environment.DEV || Environment.TEST:
      return true;
    default:
      return false;
  }
};

export { checkOrigin };
