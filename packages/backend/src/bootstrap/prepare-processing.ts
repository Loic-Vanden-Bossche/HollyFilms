import {
  getAvailableFormats,
  setFfmpegPath,
  setFfprobePath,
} from 'fluent-ffmpeg';
import { MediasConfig } from '../config/config';
import * as fs from 'fs/promises';
import { Logger } from '@nestjs/common';

const checkFfmpegAndFffprobe = () =>
  new Promise((resolve, reject) =>
    getAvailableFormats((e, formats) => (e ? reject(e) : resolve(formats))),
  );

const checkMediaFiles = (config: MediasConfig) => {
  return Promise.all([
    fs.access(config.storePathDefault).catch((err) => err),
    fs.access(config.storePathSecondary).catch((err) => err),
  ]);
};

const prepareProcessing = (config: MediasConfig) => {
  setFfmpegPath(config.ffmpegPath);
  setFfprobePath(config.ffprobePath);

  checkFfmpegAndFffprobe()
    .catch((e) => {
      Logger.error(e, 'none', 'Ffmpeg');
      process.exit(1);
    })
    .then((formats) =>
      Logger.verbose(
        `Ffmpeg is up and ready with capabilities: ${Object.keys(formats).join(
          ', ',
        )}`,
        'Ffmpeg',
      ),
    );

  checkMediaFiles(config).then((errors) =>
    errors.forEach((err, index) =>
      err
        ? Logger.error(`Media-store ${index + 1} - ${err}`, 'none', 'Medias')
        : Logger.verbose(
            `Media-store ${index + 1} - Found and ready`,
            'Medias',
          ),
    ),
  );
};

export { prepareProcessing };
