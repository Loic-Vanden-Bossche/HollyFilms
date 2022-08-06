import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Media, MediaDocument } from '../media.schema';
import { Model } from 'mongoose';
import { TmdbService } from '../../tmdb/tmdb.service';
import {
  formatOneMedia,
  MediaWithType,
  MediaWithTypeAndQueue,
} from '../medias.utils';
import { ProcessingService } from '../../processing/processing.service';
import { FileInfos } from '../schemas/file-infos.schema';

@Injectable()
export class MoviesService {
  private logger = new Logger('Movies');

  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
    private readonly tmdbService: TmdbService,
    @Inject(forwardRef(() => ProcessingService))
    private readonly processingService: ProcessingService,
  ) {}

  async findAll(): Promise<Media[]> {
    return this.mediaModel
      .find({
        tvs: { $exists: false },
      })
      .exec();
  }

  create(movie: Media): Promise<MediaWithType> {
    return this.mediaModel.create(movie).then(formatOneMedia);
  }

  add(tmdbId: number, filePath: string): Promise<MediaWithTypeAndQueue> {
    this.logger.verbose(`Adding movie ${tmdbId}`);

    return this.tmdbService.getMovie(tmdbId).then(async (movie) => {
      this.logger.log(`Added movie ${movie.data.title}`);
      const createdMovie = await this.create(movie.data);

      return this.processingService
        .addToQueue(createdMovie.data._id, filePath)
        .then(() => ({ ...createdMovie, queue: { fileName: filePath } }));
    });
  }

  finalizeProcess(mediaId: string, fileInfos: FileInfos) {
    this.logger.verbose(`Finalizing process for movie ${mediaId}`);
    return this.mediaModel
      .findByIdAndUpdate(mediaId, {
        $set: {
          available: true,
          fileInfos,
        },
      })
      .exec();
  }
}
