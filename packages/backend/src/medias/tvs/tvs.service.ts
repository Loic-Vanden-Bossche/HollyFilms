import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../indentity/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Media, MediaDocument } from '../media.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TmdbService } from '../../tmdb/tmdb.service';
import { MediaWithType } from '../medias.utils';
import { ProcessingService } from '../../processing/processing.service';

@Injectable()
export class TvsService {
  private logger = new Logger('Tvs');

  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
    private readonly userService: UsersService,
    private readonly http: HttpService,
    private readonly tmdbService: TmdbService,
    private readonly configService: ConfigService,
    private readonly processingService: ProcessingService,
  ) {}

  async findAll(): Promise<Media[]> {
    return this.mediaModel
      .find({
        tvs: { $exists: true },
      })
      .exec();
  }

  add(tmdbId: number): Promise<MediaWithType> {
    this.logger.verbose(`Adding tv ${tmdbId}`);

    return this.tmdbService.getTv(tmdbId).then((tv) => {
      this.logger.log(`Added tv ${tv.data.title}`);
      return this.mediaModel.create(tv.data).then((media) => ({
        data: media,
        mediaType: 'tv',
      }));
    });
  }

  async addSeason(id: string, seasonIndex: number): Promise<Media> {
    this.logger.verbose(`Adding season ${seasonIndex} of tv ${id}`);
    return this.mediaModel
      .findById(id)
      .exec()
      .then(async (media) => {
        return this.mediaModel
          .findByIdAndUpdate(id, {
            $set: {
              [`tvs.${seasonIndex - 1}.episodes`]:
                await this.tmdbService.getEpisodes(media.TMDB_id, seasonIndex),
              [`tvs.${seasonIndex - 1}.dateAdded`]: new Date(),
            },
          })
          .exec();
      });
  }

  async addEpisode(
    mediaId: string,
    seasonIndex: number,
    episodeIndex: number,
    filePath: string,
  ) {
    return this.processingService.addToQueue(
      mediaId,
      filePath,
      seasonIndex,
      episodeIndex,
    );
  }
}
