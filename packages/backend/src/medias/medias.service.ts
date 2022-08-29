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
  ShowcaseMedia,
} from './medias.utils';
import { Episode } from './tvs/schemas/episode.schema';
import { FileInfos } from './schemas/file-infos.schema';
import { UsersService } from '../indentity/users/users.service';
import { ProcessingService } from '../processing/processing.service';
import { QueuedProcess } from '../processing/queued-process.schema';
import * as rimraf from 'rimraf';
import { ConfigService } from '@nestjs/config';
import { MediasConfig } from '../config/config';
import { getMoviesToMigrate, getTvsToMigrate } from '../bootstrap/migrations';
import { TmdbService } from '../tmdb/tmdb.service';
import { checkObjectId, getObjectId } from '../shared/mongoose';
import { CurrentPlayedMedia } from '../indentity/users/profile';

export interface OccurrencesSummary {
  mediaCount: number;
  averageDate: number;
  tokens: string[];
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

export interface MediaCategory {
  name: string;
  count: number;
}

interface MediaIsWatched {
  media: MediaWithType;
  watchedDuration: number;
  duration: number;
  lastWatchedTime: Date;
}

@Injectable()
export class MediasService {
  logger = new Logger('Medias');

  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @Inject(forwardRef(() => ProcessingService))
    private readonly processingService: ProcessingService,
    private readonly configService: ConfigService,
    private readonly tmdbService: TmdbService,
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

  getMostRedondantGenreFromMedias(mediaIds: string[]) {
    return this.mediaModel
      .aggregate([
        { $match: { _id: { $in: mediaIds.map((id) => getObjectId(id)) } } },
        { $unwind: '$genres' },
        { $group: { _id: '$genres', count: { $sum: 1 } } },
        { $sort: { _id: 1, count: -1 } },
        { $limit: 1 },
      ])
      .exec()
      .then(([{ _id: genre }]) => genre);
  }

  getCategories(): Promise<MediaCategory[]> {
    return this.mediaModel
      .aggregate([
        { $unwind: '$genres' },
        { $group: { _id: '$genres', count: { $sum: 1 } } },
        { $sort: { _id: 1, count: -1 } },
      ])
      .exec()
      .then((categories: { _id: string; count: number }[]) =>
        categories.map((category) => ({
          name: category._id,
          count: category.count,
        })),
      );
  }

  getMediasByCategories(categories: string[]) {
    return this.mediaModel
      .find({ genres: { $all: categories } })
      .sort({ title: 'asc' })
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
                dateAdded: v.createdAt,
              })),
            })),
        ),
      );

    return [...queuedMedias, ...medias];
  }

  extractFromIds(ids: string[], medias: MediaWithType[]) {
    return ids
      .map((id) => medias.find((media) => media.data?._id.toString() === id))
      .filter((media) => !!media);
  }

  tokenFromTitle(title: string): string[] {
    return title.split(' ').map((word) => word.toLowerCase());
  }

  countOccurrences(medias: MediaWithType[]): OccurrencesSummary {
    const occurrences = {
      mediaCount: 0,
      averageDate: 0,
      tokens: [],
      genres: {},
      actors: {},
    };

    medias.forEach((media) => {
      media.data.genres.forEach((g) => {
        if (!occurrences.genres[g]) {
          occurrences.genres[g] = 1;
        } else {
          occurrences.genres[g]++;
        }
      });

      occurrences.tokens = [
        ...occurrences.tokens,
        ...this.tokenFromTitle(media.data.title),
      ];

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
    });

    occurrences.averageDate /= occurrences.mediaCount;
    return occurrences;
  }

  calculateMediaPoints(
    media: { data: Media; mediaType: string },
    occurrences: OccurrencesSummary,
    userMediasIds: string[],
  ): number {
    if (userMediasIds.includes(media.data._id.toString())) {
      return 0;
    }

    let points = 0;

    const mediaTokens = this.tokenFromTitle(media.data.title);

    mediaTokens.forEach((token) => {
      if (occurrences.tokens.includes(token)) {
        points += token.length;
      }
    });

    Object.keys(occurrences.genres).forEach((key) => {
      if (media.data.genres.includes(key)) {
        points += occurrences.genres[key];
      }
    });

    Object.keys(occurrences.actors).forEach((key) => {
      if (media.data.actors.some((a) => a.name === key)) {
        points += occurrences.actors[key];
      }
    });

    return points;
  }

  allQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query.find({}).sort({ title: 'asc' });
  }

  recentQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query.find({}).sort({ createdAt: 'desc' });
  }

  popularQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query.find({}).sort({ popularity: 'desc' });
  }

  moviesQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query
      .find({
        tvs: { $exists: false },
      })
      .sort({ title: 'asc' });
  }

  tvsQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query
      .find({
        tvs: { $exists: true },
      })
      .sort({ title: 'asc' });
  }

  animeQuery(query: Query<MediaDocument[], MediaDocument>) {
    return query.find({ genres: 'Animation' });
  }

  isExist(mediaId: string) {
    return this.mediaModel
      .exists({ _id: getObjectId(checkObjectId(mediaId)) })
      .orFail(() => {
        throw new Error('Media not found');
      });
  }

  async getRecommended(
    user: CurrentUser,
    skip = 0,
    limit = 0,
  ): Promise<MediaWithType[]> {
    const medias = await this.getMedias(true);
    const userMediaIds = [
      ...user.playedMedias.map((pm) => pm.mediaId),
      ...user.mediasInList.map((m) => m.mediaId),
      ...user.likedMedias.map((l) => l.mediaId),
    ].map((id) => id.toString());
    const occurrences = await this.countOccurrences(
      this.extractFromIds(userMediaIds, medias),
    );

    const calculateMediaPoints = medias.map(
      (media): { media: MediaWithType; points: number } => ({
        media: media,
        points: this.calculateMediaPoints(media, occurrences, [
          ...new Set(userMediaIds),
        ]),
      }),
    );

    const recommendedMedias = calculateMediaPoints
      .filter(
        (cm) =>
          !user.playedMedias.some(
            (played) => played.mediaId === cm.media.data._id.toString(),
          ),
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
  ): Query<MediaDocument[], MediaDocument> {
    switch (type) {
      case ListType.ALL:
        return this.allQuery(query);
      case ListType.RECENT:
        return this.recentQuery(query);
      case ListType.POPULAR:
        return this.popularQuery(query);
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

  queryMedias(mediaIds: string[], onlyAvailable = false, skip = 0, limit = 0) {
    const stack = [];
    const mediasObjects = mediaIds.map((id) => getObjectId(checkObjectId(id)));

    for (let i = mediasObjects.length - 1; i > 0; i--) {
      const rec = {
        $cond: [{ $eq: ['$_id', mediasObjects[i - 1]] }, i],
      };

      if (stack.length == 0) {
        rec['$cond'].push(i + 1);
      } else {
        const lval = stack.pop();
        rec['$cond'].push(lval);
      }
      stack.push(rec);
    }

    return this.mediaModel
      .aggregate([
        { $match: { _id: { $in: mediasObjects }, available: onlyAvailable } },
        { $addFields: { weight: stack[0] } },
        { $sort: { weight: 1 } },
        ...(!skip && !limit ? [] : [{ $skip: skip }, { $limit: limit }]),
      ])
      .then(formatManyMedias);
  }

  getLikedMedias(
    onlyAvailable = false,
    user: CurrentUser,
    skip = 0,
    limit = 0,
  ): Promise<MediaWithType[]> {
    return this.queryMedias(
      user.likedMedias
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((m) => m.mediaId),
      onlyAvailable,
      skip,
      limit,
    );
  }

  getInListMedias(
    onlyAvailable = false,
    user: CurrentUser,
    skip = 0,
    limit = 0,
  ): Promise<MediaWithType[]> {
    return this.queryMedias(
      user.mediasInList
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((m) => m.mediaId),
      onlyAvailable,
      skip,
      limit,
    );
  }

  isLastEpisode(
    media: MediaWithType,
    seasonIndex: number,
    episodeIndex: number,
  ): boolean {
    if (!media.data.tvs) {
      return false;
    }

    if (
      seasonIndex < media.data.tvs.filter((season) => season.available).length
    ) {
      return false;
    }

    const season = media.data.tvs[seasonIndex - 1];

    if (!season) {
      return false;
    }

    return season.episodes.filter((e) => e.available).length === episodeIndex;
  }

  isTimePlayed(watchTime: number, videoTime: number): boolean {
    return watchTime >= 0.9 * videoTime;
  }

  getWatchFinishedMedias(
    onlyAvailable = false,
    user: CurrentUser,
    skip = 0,
    limit = 0,
  ) {
    return this.getMediasWithWatchedMetadata(user.playedMedias).then((pm) =>
      pm
        .sort(
          (a, b) => b.lastWatchedTime.getTime() - a.lastWatchedTime.getTime(),
        )
        .filter((pm) => this.isTimePlayed(pm.watchedDuration, pm.duration))
        .filter((pm) => (onlyAvailable ? pm.media.data.available : true))
        .filter((m, i) => i >= skip && i < skip + limit)
        .map((m) => m.media),
    );
  }

  getContinueToWatchMedias(
    onlyAvailable = false,
    user: CurrentUser,
    skip = 0,
    limit = 0,
  ) {
    return this.getMediasWithWatchedMetadata(user.playedMedias).then((pm) =>
      pm
        .sort(
          (a, b) => b.lastWatchedTime.getTime() - a.lastWatchedTime.getTime(),
        )
        .filter((pm) => !this.isTimePlayed(pm.watchedDuration, pm.duration))
        .filter((pm) => (onlyAvailable ? pm.media.data.available : true))
        .filter((m, i) => i >= skip && i < skip + limit)
        .map((m) => m.media),
    );
  }

  getMediasWithWatchedMetadata(playedMedias: CurrentPlayedMedia[]) {
    return this.mediaModel
      .find({
        _id: {
          $in: [...new Set(playedMedias.map((pm) => pm.mediaId))],
        },
      })
      .then(formatManyMedias)
      .then((medias) => {
        return playedMedias.reduce((acc, pm) => {
          const media = medias.find(
            (m) => m.data._id.toString() === pm.mediaId,
          );

          if (!media || !pm.currentTime) {
            return acc;
          }

          if (media.mediaType === 'movie') {
            return [
              ...acc,
              {
                media,
                watchedDuration: pm.currentTime,
                duration: media.data.fileInfos.Sduration,
                lastWatchedTime: pm.createdAt,
              },
            ];
          } else {
            const current = {
              media,
              watchedDuration: this.isLastEpisode(
                media,
                pm.seasonIndex,
                pm.episodeIndex,
              )
                ? pm.currentTime
                : 0,
              duration:
                media.data.tvs[pm.seasonIndex - 1]?.episodes[
                  pm.episodeIndex - 1
                ]?.fileInfos.Sduration || 10,
              lastWatchedTime: pm.createdAt,
            };
            const foundIdx = acc.findIndex(
              (m) => m.media.data._id.toString() === pm.mediaId,
            );

            if (foundIdx === -1) {
              return [...acc, current];
            } else if (acc[foundIdx].watchedDuration === 0) {
              acc[foundIdx] = current;
            }

            return acc;
          }
        }, [] as MediaIsWatched[]);
      });
  }

  async getMedias(
    onlyAvailable = false,
    user?: CurrentUser,
    type: ListType = ListType.ALL,
    skip = 0,
    limit = 0,
  ): Promise<MediaWithType[]> {
    switch (type) {
      case ListType.RECOMMENDED:
        return this.getRecommended(user, skip, limit);
      case ListType.LIKED:
        return this.getLikedMedias(onlyAvailable, user, skip, limit);
      case ListType.INLIST:
        return this.getInListMedias(onlyAvailable, user, skip, limit);
      case ListType.CONTINUE:
        return this.getContinueToWatchMedias(onlyAvailable, user, skip, limit);
      case ListType.WATCHED:
        return this.getWatchFinishedMedias(onlyAvailable, user, skip, limit);
      default:
        return this.applyLimiters(
          this.mediasQueryFromType(
            this.mediaModel.find(onlyAvailable ? { available: true } : {}),
            type,
          ),
          skip,
          limit,
        )
          .exec()
          .then(formatManyMedias);
    }
  }

  getShowcaseMedias(): Promise<ShowcaseMedia[]> {
    return this.getMedias(true, null, ListType.POPULAR).then((medias) =>
      medias.map((media) => ({
        _id: media.data._id,
        title: media.data.title,
        poster_path: media.data.poster_path,
        backdrop_path: media.data.backdrop_path,
        selected: false,
        mediaType: media.mediaType,
        audioLangAvailable: media.data.fileInfos?.audioLangAvailable || [],
      })),
    );
  }

  getFeatured(user: CurrentUser): Promise<MediaWithTypeAndFeatured[]> {
    const targetNumber = 10;
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
    ])
      .then((medias) => medias.flat())
      .then(async (medias) => {
        const getUnique = (mediasToProcess) => {
          return Array.from(
            new Set(mediasToProcess.map((m) => m.data._id)),
          ).map((id) => mediasToProcess.find((m) => m.data._id === id));
        };

        let mediasToReturn = getUnique(medias);

        while (mediasToReturn.length < targetNumber) {
          const missing = await Promise.all(
            [...Array(targetNumber - mediasToReturn.length).keys()].map(() =>
              this.getRandomMedia(),
            ),
          );
          mediasToReturn = getUnique([...mediasToReturn, ...missing]);
        }
        return mediasToReturn;
      });
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

          getTvsToMigrate().then((tvs) => this.mediaModel.insertMany(tvs));
        }
      });
  }

  async updateEpisodes(
    originalEpisodes: Episode[] | undefined,
    TMDB_id: number,
    seasonIndex,
  ): Promise<Episode[]> {
    const isAvailable = (ei: number) => {
      if (!originalEpisodes || !originalEpisodes[ei]) return false;
      return originalEpisodes[ei].available;
    };

    if (!originalEpisodes) {
      return originalEpisodes;
    } else {
      return this.tmdbService
        .getEpisodes(TMDB_id, seasonIndex)
        .then((episodes) =>
          episodes.map((episode, i) => ({
            ...(originalEpisodes[i] || {}),
            ...episode,
            available: isAvailable(i),
          })),
        );
    }
  }

  async updateOne(media: MediaWithType) {
    this.logger.log(`updating ${media.data.title}`);
    const newMedia = await (media.mediaType === 'tv'
      ? this.tmdbService.getTv(media.data.TMDB_id)
      : this.tmdbService.getMovie(media.data.TMDB_id));

    return this.mediaModel.findByIdAndUpdate(media.data._id, {
      $set: {
        ...newMedia.data,
        tvs: newMedia.data?.tvs
          ? await Promise.all(
              newMedia.data?.tvs?.map((season, i) => {
                return this.updateEpisodes(
                  media.data.tvs[i].episodes,
                  media.data.TMDB_id,
                  i + 1,
                ).then((episodes) => ({
                  ...(season || {}),
                  available: media.data.tvs[i].available,
                  dateAdded: media.data.tvs[i].dateAdded,
                  episodes,
                }));
              }),
            )
          : undefined,
        available: media.data.available,
        fileInfos: media.data.fileInfos,
        createdAt: media.data.createdAt,
      },
    });
  }

  async getRandomMedia(): Promise<MediaWithType> {
    return this.mediaModel
      .find({ available: true })
      .limit(1)
      .skip(
        Math.floor(
          Math.random() * (await this.mediaModel.countDocuments().exec()),
        ),
      )
      .exec()
      .then((medias) => medias[0])
      .then(formatOneMedia);
  }

  updateAllMedias() {
    this.getMedias()
      .then((medias) =>
        Promise.all(medias.map((media) => this.updateOne(media))),
      )
      .catch((err) => {
        this.logger.error(`An error occurred while updating medias: ${err}`);
        throw new HttpException(
          'Une erreur est survenue',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
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
      this.logger.error('file not found: ' + filename);
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
          this.logger.verbose('unknown file type: ' + path.extname(mediaPath));
          res.writeHead(500);
          res.end();
      }
    }

    return;
  }
}
