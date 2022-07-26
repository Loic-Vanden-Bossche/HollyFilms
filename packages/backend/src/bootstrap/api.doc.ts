import { exec } from 'child_process';

const generateAPIDocs = (
  mdOutfile = 'API.md',
  yamlOutfile = 'openapi.yaml',
) => {
  return new Promise((resolve, reject) => {
    exec(
      `npx widdershins ${yamlOutfile} -o ${mdOutfile} --omitHeader`,
      (err, stdout, stderr) => {
        if (err) {
          reject(stderr);
        }
        if (stderr) {
          reject(stderr);
        }
        resolve(stdout);
      },
    );
  });
};

export { generateAPIDocs };
