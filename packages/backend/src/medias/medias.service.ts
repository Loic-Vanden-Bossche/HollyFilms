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
import { Media, MediaDocument } from './media.schema';
import CurrentUser from '../indentity/users/current';
import { Model, Query } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  FeaturedType,
  formatManyMedias,
  formatOneMedia,
  ListType,
  MediaType,
  MediaWithType,
  MediaWithTypeAndFeatured,
  MediaWithTypeAndQueue,
} from './medias.utils';
import { PlayedMedia } from './schemas/played-media.schema';
import { Episode } from './tvs/schemas/episode.schema';
import { FileInfos } from './schemas/file-infos.schema';
import { UsersService } from '../indentity/users/users.service';
import { ProcessingService } from '../processing/processing.service';
import { QueuedProcess } from '../processing/queued-process.schema';
import * as rimraf from 'rimraf';
import { ConfigService } from '@nestjs/config';
import { MediasConfig } from '../config/config';
import { getMoviesToMigrate } from '../bootstrap/migrations';

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
    private readonly configService: ConfigService,
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

  allQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query.find({}).sort({ title: 'asc' });
  }

  recentQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query.find({}).sort({ createdAt: 'asc' });
  }

  popularQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query.find({}).sort({ popularity: 'desc' });
  }

  inlistQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query.find().sort({ title: 'asc' });
  }

  likedQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query.find({}).sort({ title: 'asc' });
  }

  watchedQuery(
    query: Query<MediaDocument[], MediaDocument>,
    user: CurrentUser,
  ) {
    return query.find({
      _id: {
        $in: user.playedMedias
          .filter((pm) => this.isWatched(pm))
          .map((played) => played.media),
      },
    });
  }

  continueQuery(
    query: Query<MediaDocument[], MediaDocument>,
    user: CurrentUser,
  ) {
    return query.find({
      _id: {
        $in: user.playedMedias
          .filter((pm) => !this.isWatched(pm))
          .map((played) => played.media),
      },
    });
  }

  moviesQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query.find({
      tvs: { $exists: false },
    });
  }

  tvsQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query.find({
      tvs: { $exists: true },
    });
  }

  animeQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query.find({ genres: 'Animation' });
  }

  async getRecommended(
    user: CurrentUser,
    skip = 0,
    limit = 0,
  ): Promise<MediaWithType[]> {
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

    const recommendedMedias = calculateMediaPoints
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

    return limit
      ? recommendedMedias.slice(skip, skip + limit)
      : recommendedMedias;
  }

  mediasQueryFromType(
    query: Query<MediaDocument[], MediaDocument>,
    type: ListType,
    user: CurrentUser,
  ): Query<MediaDocument[], MediaDocument> {
    switch (type) {
      case ListType.ALL:
        return this.allQuery(query);
      case ListType.RECENT:
        return this.recentQuery(query);
      case ListType.POPULAR:
        return this.popularQuery(query);
      case ListType.INLIST:
        return this.inlistQuery(query);
      case ListType.LIKED:
        return this.likedQuery(query);
      case ListType.WATCHED:
        return this.watchedQuery(query, user);
      case ListType.CONTINUE:
        return this.continueQuery(query, user);
      case ListType.MOVIE:
        return this.moviesQuery(query);
      case ListType.SERIES:
        return this.tvsQuery(query);
      case ListType.ANIME:
        return this.animeQuery(query);
    }
  }

  applyLimiters(
    query: Query<MediaDocument[], MediaDocument>,
    skip: number,
    limit: number,
  ): Query<MediaDocument[], MediaDocument> {
    return limit ? query.skip(skip).limit(limit) : query;
  }

  async getMedias(
    onlyAvailable = false,
    user?: CurrentUser,
    type: ListType = ListType.ALL,
    skip = 0,
    limit = 0,
  ): Promise<MediaWithType[]> {
    if (type !== ListType.RECOMMENDED) {
      return this.applyLimiters(
        this.mediasQueryFromType(
          this.mediaModel.find(onlyAvailable ? { available: true } : {}),
          type,
          user,
        ),
        skip,
        limit,
      )
        .exec()
        .then(formatManyMedias);
    }

    return this.getRecommended(user, skip, limit);
  }

  getFeatured(user: CurrentUser): Promise<MediaWithTypeAndFeatured[]> {
    const featuredMap = [
      { listType: ListType.POPULAR, number: 3, featured: FeaturedType.POPULAR },
      {
        listType: ListType.RECOMMENDED,
        number: 3,
        featured: FeaturedType.RECOMMENDED,
      },
      { listType: ListType.RECENT, number: 2, featured: FeaturedType.RECENT },
      { listType: ListType.INLIST, number: 1, featured: FeaturedType.INLIST },
      {
        listType: ListType.CONTINUE,
        number: 1,
        featured: FeaturedType.CONTINUE,
      },
    ];

    return Promise.all([
      ...featuredMap.map(({ listType, number, featured }) =>
        this.getMedias(true, user, listType, 0, number).then((medias) =>
          medias.map((media) => ({ ...media, featured })),
        ),
      ),
    ]).then((medias) => medias.flat());
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

  migrateFromDatabase() {
    this.mediaModel
      .countDocuments()
      .exec()
      .then((count) => {
        if (count <= 0) {
          getMoviesToMigrate().then((movies) =>
            this.mediaModel.insertMany(movies),
          );
        }
      });
  }

  async getStream(
    res: Response,
    location: string,
    mediaPath: string,
    encodingHeader: string,
  ): Promise<void> {
    const config = this.configService.get<MediasConfig>('medias');
    location =
      location == 'default'
        ? config.storePathDefault
        : location == 'secondary'
        ? config.storePathSecondary
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
