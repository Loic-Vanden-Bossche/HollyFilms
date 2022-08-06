import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { env } from 'process';
import { Media, MediaDocument } from './media.schema';
import CurrentUser from '../indentity/users/current';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  formatManyMedias,
  formatOneMedia,
  MediaType,
  MediaWithType,
  MediaWithTypeAndQueue,
} from './medias.utils';
import { PlayedMedia } from './schemas/played-media.schema';
import { Episode } from './tvs/schemas/episode.schema';
import { FileInfos } from './schemas/file-infos.schema';
import { UsersService } from '../indentity/users/users.service';
import { ProcessingService } from '../processing/processing.service';
import { QueuedProcess } from '../processing/queued-process.schema';
import * as rimraf from 'rimraf';

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
  logger = new Logger('Medias');

  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
    private readonly userService: UsersService,
    @Inject(forwardRef(() => ProcessingService))
    private readonly processingService: ProcessingService,
  ) {}

  async getMedia(id: string) {
    return this.mediaModel
      .findById(id)
      .orFail(() => {
        throw new HttpException(`Media not found`, HttpStatus.NOT_FOUND);
      })
      .exec()
      .then(formatOneMedia);
  }

  async deleteMedia(id: string) {
    this.logger.log(`Deleting media ${id}`);
    return this.userService
      .deletePlayedMediasOccurences(id)
      .then(() => this.mediaModel.findByIdAndDelete(id))
      .then((media) => this.removeMediaFromDisk(id).then(() => media));
  }

  async removeMediaFromDisk(mediaId): Promise<void> {
    const path = this.processingService.getTargetPath(mediaId);
    if (fs.existsSync(path)) rimraf.sync(path);
  }

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

  async searchQuery(
    query = '',
    onlyAvailable = false,
  ): Promise<MediaWithType[]> {
    if (query && query !== 'blank') {
      return this.mediaModel
        .find({
          ...(onlyAvailable ? { available: true } : {}),
          $or: [{ title: new RegExp(query, 'i') }],
        })
        .sort({ title: 'asc' })
        .exec()
        .then(formatManyMedias);
    }

    return this.getMedias(onlyAvailable);
  }

  async adminSearchQuery(query: string): Promise<MediaWithTypeAndQueue[]> {
    let medias = await this.searchQuery(query);

    const queue = await this.processingService.getQueue().then((queue) =>
      queue.reduce((acc, cur) => {
        acc[cur.media._id.toString()] = [
          ...(acc[cur.media._id.toString()] || []),
          cur,
        ];
        return acc;
      }, {} as Record<string, QueuedProcess[]>),
    );

    for (const mediaId of Object.keys(queue)) {
      const index = medias.findIndex(
        (media) => media.data._id.toString() === mediaId,
      );
      if (index !== -1) {
        medias = [...medias.slice(0, index), ...medias.slice(index + 1)];
      }
    }

    const queuedMedias: Array<MediaWithType | MediaWithTypeAndQueue> =
      await Promise.all(
        Object.entries(queue).map(([mediaId, video]) =>
          this.mediaModel
            .findById(mediaId)
            .exec()
            .then(formatOneMedia)
            .then((media) => ({
              ...media,
              queue: video.map((v) => ({
                _id: v._id,
                filePath: v.filePath,
                seasonIndex: v.seasonIndex,
                episodeIndex: v.episodeIndex,
                dateAdded: v.dateAdded,
              })),
            })),
        ),
      );

    return [...queuedMedias, ...medias];
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

  async getMedias(onlyAvailable = false): Promise<MediaWithType[]> {
    return this.mediaModel
      .find(onlyAvailable ? { available: true } : {})
      .sort({ title: 'asc' })
      .exec()
      .then(formatManyMedias);
  }

  async updatePopularity() {
    /*this.getMedias().then((medias) => {

    });
    console.log('updating tvs populatiry ...');
    const tvs = await this.findAll();

    for (const tv of tvs) {
      const TMDBTv = await this.tmdbService.getTv(tv.TMDB_id.toString());

      if (TMDBTv) {
        console.log(TMDBTv.title, TMDBTv.popularity);
        this.updateOne(tv._id.valueOf().toString(), {
          $set: { popularity: TMDBTv.popularity },
        });
      }
    }*/
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
