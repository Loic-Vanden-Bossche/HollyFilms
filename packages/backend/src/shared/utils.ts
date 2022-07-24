import { Environment } from 'src/config/config.default';
import * as path from 'path';

const appendExecutionPath = (env: Environment, execPath: string) => {
  return path.join(
    ...[
      process.cwd(),
      ...(env === Environment.DEV ? ['src'] : []),
      ...execPath.split('/'),
    ],
  );
};

export { appendExecutionPath };
