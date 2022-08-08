import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { TMDBConfig } from '../config/config';
import { MediaWithType } from '../medias/medias.utils';
import {
  TMDBAdminSearchResult,
  TMDBMedia,
  TMDBMovie,
  TMDBSearchResult,
  TMDBTVShow,
} from './tmdb.models';

export type SearchType = 'movie' | 'tv' | 'both';

@Injectable()
export class TmdbService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getBackdropPath(relativePath: string | null): string {
    return relativePath
      ? 'https://image.tmdb.org/t/p/w1280' + relativePath
      : null;
  }

  getPosterPath(relativePath: string): string {
    return relativePath
      ? 'https://image.tmdb.org/t/p/w500' + relativePath
      : null;
  }

  async searchQuery(
    query: string,
    type: SearchType,
  ): Promise<TMDBAdminSearchResult[]> {
    const getParamFromType = (): string => {
      switch (type) {
        case 'movie':
          return 'movie';
        case 'tv':
          return 'tv';
        case 'both':
          return 'multi';
      }
    };

    const filterByType = (result: TMDBMedia): boolean => {
      switch (type) {
        case 'movie':
        case 'tv':
          return true;
        case 'both':
          return result.media_type === 'movie' || result.media_type === 'tv';
      }
    };

    const config = this.configService.get<TMDBConfig>('tmdb');

    const searchResults = await firstValueFrom(
      this.httpService.get<TMDBSearchResult>(
        `${config.apiUrl}/search/${getParamFromType()}?api_key=${
          config.apiKey
        }&language=fr-FR&query=${encodeURI(query)}&page=1&include_adult=false`,
      ),
    ).then((response) => response.data.results);

    return searchResults.filter(filterByType).map((media) => ({
      original_title:
        'title' in media ? media.title : 'name' in media ? media.name : null,
      TMDB_id: media.id,
      poster_path: this.getPosterPath(media.poster_path),
      backdrop_path: this.getBackdropPath(media.backdrop_path),
      release_date:
        'first_air_date' in media
          ? media.first_air_date
          : 'release_date' in media
          ? media.release_date
          : null,
      mediaType: type === 'both' ? (media.media_type as 'tv' | 'movie') : type,
    }));
  }

  async getTv(tmdbId: number): Promise<MediaWithType> {
    const config = this.configService.get<TMDBConfig>('tmdb');

    const tv = await firstValueFrom(
      this.httpService.get<TMDBTVShow>(
        `${config.apiUrl}/tv/${tmdbId}?api_key=${config.apiKey}&language=fr-FR&append_to_response=videos,credits,translations,reviews`,
      ),
    ).then((response) => response.data);

    return {
      data: {
        title: tv.name,
        TMDB_id: tv.id,
        runtime: tv.episode_run_time[0],
        genres: tv.genres.map((g) => g.name),
        overview: tv.overview,
        popularity: tv.popularity,
        release_date: tv.first_air_date,
        poster_path: this.getPosterPath(tv.poster_path),
        backdrop_path: this.getBackdropPath(tv.backdrop_path),
        tagline: tv.tagline,
        production_companies: tv.production_companies.map((c) => {
          return {
            name: c.name,
            logo_path: c.logo_path
              ? 'https://image.tmdb.org/t/p/w185' + c.logo_path
              : null,
          };
        }),
        director: tv.created_by.map((c) => ({
          name: c.name,
          profile_path: c.profile_path
            ? 'https://image.tmdb.org/t/p/w185' + c.profile_path
            : null,
        }))[0],
        actors: tv.credits.cast.slice(0, 8).map((c) => {
          return {
            name: c.name,
            character: c.character,
            profile_path: c.profile_path
              ? 'https://image.tmdb.org/t/p/w185' + c.profile_path
              : null,
          };
        }),
        tvs: tv.seasons
          .filter((s) => s.name.toLowerCase() != 'specials')
          .map((c) => ({
            index: c.season_number,
            name: c.name,
            episode_count: c.episode_count,
            overview: c.overview,
            poster_path: c.poster_path
              ? 'https://image.tmdb.org/t/p/w500' + c.poster_path
              : null,
            available: false,
          })),

        rating: tv.vote_average,
        reviews: tv.reviews.results.length
          ? tv.reviews.results.map((c) => {
              if (c.author_details.avatar_path) {
                if (
                  c.author_details.avatar_path.toString().indexOf('https') != 1
                ) {
                  c.author_details.avatar_path =
                    'https://image.tmdb.org/t/p/w185' +
                    c.author_details.avatar_path;
                } else {
                  c.author_details.avatar_path = c.author_details.avatar_path
                    .toString()
                    .substring(1);
                }
              }
              return {
                author: {
                  name: c.author_details.username,
                  profile_path: c.author_details.avatar_path,
                },
                rating: c.author_details.rating,
                content: c.content,
              };
            })
          : [],
        trailer_key: tv.videos.results
          .filter((obj) => obj.type === 'Trailer' && obj.site === 'YouTube')
          .map((c) => c.key)[0],
        budget: tv.budget,
        revenue: tv.revenue,
      },
      mediaType: 'tv',
    };
  }

  async getMovie(tmdbId: number): Promise<MediaWithType> {
    const config = this.configService.get<TMDBConfig>('tmdb');

    const movie = await firstValueFrom(
      this.httpService.get<TMDBMovie>(
        `${config.apiUrl}/movie/${tmdbId}?api_key=${config.apiKey}&language=fr-FR&append_to_response=videos,credits,translations,reviews`,
      ),
    ).then((response) => response.data);

    return {
      data: {
        TMDB_id: movie.id,
        title: movie.title,
        runtime: movie.runtime[0],
        budget: movie.budget,
        genres: movie.genres.map((g) => g.name),
        overview: movie.overview,
        popularity: movie.popularity,
        release_date: movie.release_date,
        revenue: movie.revenue,
        poster_path: this.getPosterPath(movie.poster_path),
        backdrop_path: this.getBackdropPath(movie.backdrop_path),
        tagline: movie.tagline,
        production_companies: movie.production_companies.map((c) => ({
          name: c.name,
          logo_path: c.logo_path
            ? 'https://image.tmdb.org/t/p/w185' + c.logo_path
            : null,
        })),
        director: movie.credits.crew
          .filter((obj) => obj.job === 'Director')
          .map((c) => ({
            name: c.name,
            profile_path: c.profile_path
              ? 'https://image.tmdb.org/t/p/w185' + c.profile_path
              : null,
          }))[0],
        actors: movie.credits.cast.slice(0, 8).map((c) => ({
          name: c.name,
          character: c.character,
          profile_path: c.profile_path
            ? 'https://image.tmdb.org/t/p/w185' + c.profile_path
            : null,
        })),
        rating: movie.vote_average,
        reviews: movie.reviews.results.length
          ? movie.reviews.results.map((c) => {
              if (c.author_details.avatar_path) {
                if (
                  c.author_details.avatar_path.toString().indexOf('https') != 1
                ) {
                  c.author_details.avatar_path =
                    'https://image.tmdb.org/t/p/w185' +
                    c.author_details.avatar_path;
                } else {
                  c.author_details.avatar_path = c.author_details.avatar_path
                    .toString()
                    .substring(1);
                }
              }
              return {
                author: {
                  name: c.author_details.username,
                  profile_path: c.author_details.avatar_path,
                },
                rating: c.author_details.rating,
                content: c.content,
              };
            })
          : null,
        trailer_key: movie.videos.results
          .filter((obj) => obj.type === 'Trailer' && obj.site === 'YouTube')
          .map((c) => c.key)[0],
        fileInfos: {
          isProcessing: true,
          maxQualilty: null,
          audioLangAvaliables: [],
          maxQualiltyTag: '',
          Sduration: null,
          thumbnailsGenerated: false,
          extraQualities: [],
          location: 'secondary',
        },
      },
      mediaType: 'movie',
    };
  }
}
