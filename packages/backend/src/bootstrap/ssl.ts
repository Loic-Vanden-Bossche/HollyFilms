import { APIConfig, getConfig, SSLConfig } from '../config/config';
import { NestApplicationOptions } from '@nestjs/common';
import * as fs from 'fs/promises';

const getSSLOptions = async (
  sslConfig: SSLConfig,
): Promise<NestApplicationOptions> => {
  if (sslConfig.enabled) {
    try {
      return {
        httpsOptions: await Promise.all([
          fs.readFile(sslConfig.keyPath),
          fs.readFile(sslConfig.certPath),
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

const warpSSLConfig = async (): Promise<{
  config: APIConfig;
  sslOptions: NestApplicationOptions;
}> => {
  const config = getConfig(process.env);
  return { config, sslOptions: await getSSLOptions(config.ssl) };
};

export { warpSSLConfig };
