import { Injectable } from '@nestjs/common';
import { UsersService } from '../../indentity/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Media, MediaDocument } from '../schemas/media.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TMDBConfig } from '../../config/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TvsService {
  constructor(
    private readonly userService: UsersService,
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Media[]> {
    return this.mediaModel
      .find({
        tvs: { $exists: true },
      })
      .exec();
  }

  async addSeason(id: string, seasonIndex: number): Promise<Media> {
    const config = this.configService.get<TMDBConfig>('tmdb');

    return this.mediaModel
      .findById(id)
      .exec()
      .then(async (media) => {
        const episodes = await firstValueFrom(
          this.http.get(
            `${config.apiUrl}/tv/${media.TMDB_id}/season/${seasonIndex}?api_key=${config.apiKey}&language=en-US&append_to_response=videos,credits,translations,reviews`,
          ),
        )
          .then((response) => response.data.episodes)
          .then((episodes) =>
            episodes.map((episode) => ({
              name: episode.name,
              index: episode.episode_number,
              overview: episode.overview,
              still_path: episode.still_path
                ? 'https://image.tmdb.org/t/p/w1280' + episode.still_path
                : null,
              vote_average: episode.vote_average,
              avaliable: false,
            })),
          );

        return this.mediaModel
          .findById(id)
          .exec()
          .then((media) => {
            media.tvs[seasonIndex - 1].episodes = episodes;
            media.tvs[seasonIndex - 1].avaliable = true;
            media.tvs[seasonIndex - 1].dateAdded = new Date();
            return media.save();
          });
      });
  }

  async addEpisode(
    id: string,
    seasonIndex: number,
    episodeIndex: number,
    filePath: string,
  ): Promise<void> {
    if (id && seasonIndex && episodeIndex && filePath) {
      /*this.processingService.addToQueue({
        fileName: filePath,
        mediaType: 'tv',
        id: id,
        seasonIndex: seasonIndex,
        episodeIndex: episodeIndex,
      });*/
    }

    return;
  }
}
