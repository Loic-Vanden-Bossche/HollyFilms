import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../../indentity/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Media, MediaDocument } from '../media.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { TmdbService } from '../../tmdb/tmdb.service';
import { MediaWithType } from '../medias.utils';

@Injectable()
export class MoviesService {
  private logger = new Logger('Movies');

  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
    private readonly userService: UsersService,
    private readonly http: HttpService,
    private readonly tmdbService: TmdbService,
  ) {}

  async findAll(): Promise<Media[]> {
    return this.mediaModel
      .find({
        tvs: { $exists: false },
      })
      .exec();
  }

  add(tmdbId: number): Promise<MediaWithType> {
    this.logger.verbose(`Adding movie ${tmdbId}`);

    return this.tmdbService.getMovie(tmdbId).then((movie) => {
      this.logger.log(`Added tv ${movie.data.title}`);
      return this.mediaModel.create(movie.data).then((media) => ({
        data: media,
        mediaType: 'movie',
      }));
    });
  }
}
