import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { env } from 'process';
import { Media, MediaDocument } from './schemas/media.schema';
import CurrentUser from '../indentity/users/current';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  formatManyAdminMedias,
  formatManyMedias,
  formatOneMedia,
  MediaType,
  MediaWithType,
} from './medias.utils';
import { PlayedMedia } from './schemas/played-media.schema';
import { Episode } from './tvs/episode.schema';
import { FileInfos } from './schemas/file-infos.schema';

export interface OccurrencesSummary {
  mediaCount: number;
  averageDate: number;
  genres: Record<string, number>;
  actors: Record<string, number>;
}

export interface AdminMedia {
  _id: string;
  title: string;
  backdrop_path: string;
  release_date: string;
  mediaType: MediaType;
  fileInfos: FileInfos;
}

@Injectable()
export class MediasService {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
  ) {}

  async getMostPopular(): Promise<MediaWithType[]> {
    return this.mediaModel
      .find({})
      .sort({ popularity: 'asc' })
      .exec()
      .then(formatManyMedias);
  }

  async getRecommended(user: CurrentUser): Promise<MediaWithType[]> {
    const medias = await this.getMedias();

    const calculateMediaPoints = medias.map(
      (
        media,
      ): {
        media: MediaWithType;
        points: number;
      } => {
        return {
          media: media,
          points: this.calculateMediaPoints(
            media,
            this.countOccurences(medias, user.playedMedias),
          ),
        };
      },
    );

    return calculateMediaPoints
      .filter(
        (cm) =>
          !user.playedMedias.some((played) => played.media === cm.media.data),
      )
      .sort((a, b) => {
        if (a.points > b.points) {
          return -1;
        }
        if (a.points < b.points) {
          return 1;
        }
        return 0;
      })
      .map((cm) => cm.media);
  }

  async getContinueToWatch(user: CurrentUser): Promise<MediaWithType[]> {
    return this.mediaModel
      .find({
        _id: {
          $in: user.playedMedias
            .filter((pm) => !this.isWatched(pm))
            .map((played) => played.media),
        },
      })
      .then(formatManyMedias);
  }

  async getSeeAgain(user: CurrentUser): Promise<MediaWithType[]> {
    return this.mediaModel
      .find({
        _id: {
          $in: user.playedMedias
            .filter((pm) => this.isWatched(pm))
            .map((played) => played.media),
        },
      })
      .exec()
      .then(formatManyMedias);
  }

  async searchQuery(query: string): Promise<MediaWithType[]> {
    if (query !== 'blank') {
      return this.mediaModel
        .find({
          $or: [{ title: new RegExp(query, 'i') }],
        })
        .exec()
        .then(formatManyMedias);
    }

    return this.getMedias();
  }

  async adminSearchQuerry(query: string): Promise<AdminMedia[]> {
    const medias = await this.searchQuery(query).then(formatManyAdminMedias);

    /*const queue = this.processingService.getQueue();

    let index = 0;

    for (const videoInQueue of queue.videos) {
      medias.forEach((item, i) => {
        if (item._id.toString() == videoInQueue.id.toString()) {
          medias.splice(i, 1);
          medias.splice(index, 0, item);
          index++;
        }
      });
    }*/

    return medias;
  }

  async getRandomBackdrop(): Promise<{ path: string }> {
    const medias = await this.getMedias();

    const res = medias
      .filter((media) => {
        return media.data.backdrop_path;
      })
      .map((media) => {
        return { path: media.data.backdrop_path };
      });

    return res[Math.floor(Math.random() * res.length)];
  }

  isTimePlayed(watchTime: number, videoTime: number): boolean {
    return watchTime >= 0.9 * videoTime;
  }

  isWatched(playedMedia: PlayedMedia): boolean {
    const media = formatOneMedia(playedMedia.media);
    if (media.mediaType === 'movie') {
      return this.isTimePlayed(
        playedMedia.currentTime,
        media.data.fileInfos.Sduration,
      );
    } else {
      return this.flattedEpisodes(media).some((episode) =>
        this.isTimePlayed(playedMedia.currentTime, episode.fileInfos.Sduration),
      );
    }
  }

  flattedEpisodes(media: MediaWithType): Episode[] {
    if (media.mediaType === 'movie') {
      return [];
    } else {
      return media.data.tvs.flatMap((tv) => tv.episodes);
    }
  }

  countOccurences(
    medias: MediaWithType[],
    playedMedias: PlayedMedia[],
  ): OccurrencesSummary {
    const occurrences = {
      mediaCount: 0,
      averageDate: 0,
      genres: {},
      actors: {},
    };

    medias.forEach((media) =>
      playedMedias.forEach((played) => {
        if (played.media == media.data) {
          media.data.genres.forEach((g) => {
            if (!occurrences.genres[g]) {
              occurrences.genres[g] = 1;
            } else {
              occurrences.genres[g]++;
            }
          });

          media.data.actors.forEach((a) => {
            if (!occurrences.actors[a.name]) {
              occurrences.actors[a.name] = 1;
            } else {
              occurrences.actors[a.name]++;
            }
          });

          const date = new Date(media.data.release_date);
          const seconds = date.getTime() / 1000;

          occurrences.averageDate += seconds;
          occurrences.mediaCount++;
        }
      }),
    );

    occurrences.averageDate /= occurrences.mediaCount;

    return occurrences;
  }

  calculateMediaPoints(
    media: { data: Media; mediaType: string },
    occurences: OccurrencesSummary,
  ): number {
    let points = 0;

    const keys = Object.keys(occurences.genres);

    keys.forEach((key) => {
      if (media.data.genres.includes(key)) {
        points += occurences.genres[key];
      }

      if (media.data.actors.some((a) => a.name === key)) {
        points += occurences.actors[key];
      }
    });

    return points;
  }

  async getMedias(): Promise<MediaWithType[]> {
    return this.mediaModel
      .find({})
      .sort({ title: 'asc' })
      .exec()
      .then(formatManyMedias);
  }

  async getStream(
    res: Response,
    location: string,
    mediaPath: string,
    encodingHeader: string,
  ): Promise<void> {
    location =
      location == 'default'
        ? env.MEDIAS_LOCATION_DEFAULT
        : location == 'secondary'
        ? env.MEDIAS_LOCATION_SECONDARY
        : null;

    if (!location) {
      res.writeHead(404, {
        'Content-Type': 'text/plain',
      });
      res.write('Bad location.\n');
      res.end();
      return;
    }

    const filename = path.join(location, mediaPath);

    if (!fs.existsSync(filename)) {
      console.log('file not found: ' + filename);
      res.writeHead(404, {
        'Content-Type': 'text/plain',
      });
      res.write('file not found: ' + filename);
      res.end();
    } else {
      let stream = null;

      switch (path.extname(mediaPath)) {
        case '.m3u8':
          fs.readFile(filename, function (err, contents) {
            if (err) {
              res.writeHead(500);
              res.end();
            } else if (contents) {
              if (encodingHeader.match(/\bgzip\b/)) {
                zlib.gzip(contents, function (err, zip) {
                  if (err) throw err;

                  res.writeHead(200, {
                    'content-encoding': 'gzip',
                  });
                  res.end(zip);
                });
              } else {
                res.end(contents, 'utf-8');
              }
            } else {
              res.writeHead(500);
              res.end();
            }
          });
          break;
        case '.ts':
          res.writeHead(200, {
            'Content-Type': 'video/MP2T',
          });
          stream = fs.createReadStream(filename, {
            highWaterMark: 64 * 1024,
          });
          stream.pipe(res);
          break;
        case '.aac':
          res.writeHead(200, {
            'Content-Type': 'audio/aac',
          });
          stream = fs.createReadStream(filename, {
            highWaterMark: 64 * 1024,
          });
          stream.pipe(res);
          break;
        case '.vtt':
          res.writeHead(200, {
            'Content-Type': 'text/vtt',
          });

          stream = fs.createReadStream(filename, {
            highWaterMark: 64 * 1024,
          });
          stream.pipe(res);
          break;

        case '.jpg':
          res.writeHead(200, {
            'Content-Type': 'image/jpeg',
          });
          stream = fs.createReadStream(filename, {
            highWaterMark: 64 * 1024,
          });
          stream.pipe(res);
          break;
        default:
          console.log('unknown file type: ' + path.extname(mediaPath));
          res.writeHead(500);
          res.end();
      }
    }

    return;
  }
}
