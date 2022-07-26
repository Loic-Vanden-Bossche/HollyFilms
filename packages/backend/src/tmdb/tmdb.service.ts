import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { TMDBConfig } from '../config/config';
import { MediaWithType } from '../medias/medias.utils';

export interface TMDBMovie {
  media_type: string;
  title: string;
  id: number;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
}

export interface TMDBTVShow {
  media_type: string;
  name: string;
  id: number;
  backdrop_path: string;
  poster_path: string;
  first_air_date: string;
}

export interface TMDBSearchResult {
  results: TMDBMedia[];
}

export interface OnlineSearchResult {
  original_title: string;
  TMDB_id: number;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  mediaType: 'tv' | 'movie';
}

type TMDBMedia = TMDBMovie | TMDBTVShow;

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

  async searchQuery(querry: string): Promise<OnlineSearchResult[]> {
    const config = this.configService.get<TMDBConfig>('tmdb');

    const searchResults = await firstValueFrom(
      this.httpService.get<TMDBSearchResult>(
        `${config.apiUrl}/search/multi?api_key=${
          config.apiKey
        }&language=en-US&query=${encodeURI(querry)}&page=1&include_adult=false`,
      ),
    ).then((response) => response.data.results);

    return searchResults
      .filter(
        (media) => media.media_type === 'tv' || media.media_type === 'movie',
      )
      .map((media) => ({
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
        mediaType: media.media_type as 'tv' | 'movie',
      }));
  }

  async getTv(tmdbId: string): Promise<MediaWithType> {
    const config = this.configService.get<TMDBConfig>('tmdb');

    const TMDB_Tv = await firstValueFrom(
      this.httpService.get(
        `${config.apiUrl}/tv/${tmdbId}?api_key=${config.apiKey}&language=en-US&append_to_response=videos,credits,translations,reviews`,
      ),
    );

    const tv = TMDB_Tv.data;

    return {
      data: {
        title: tv.name,
        titleFr: tv.translations.translations
          .filter((obj) => {
            return obj.iso_3166_1 === 'FR';
          })
          .map((c) => {
            return JSON.stringify(c.data.name).length - 2
              ? c.data.name
              : tv.name;
          })[0],
        mediaType: 'tv',
        TMDB_id: tv.id,
        runtime: tv.episode_run_time,
        genres: tv.genres.map((g) => g.name),
        overview: tv.overview,
        overviewFR: tv.translations.translations
          .filter((obj) => {
            return obj.iso_3166_1 === 'FR';
          })
          .map((c) => {
            return JSON.stringify(c.data.overview).length - 2
              ? c.data.overview
              : tv.overview;
          })[0],
        popularity: tv.popularity,
        release_date: tv.first_air_date,
        poster_path: this.getPosterPath(tv.poster_path),
        backdrop_path: this.getBackdropPath(tv.backdrop_path),
        tagline: JSON.stringify(tv.tagline).length - 2 ? tv.tagline : null,
        taglineFr: tv.translations.translations
          .filter((obj) => {
            return obj.iso_3166_1 === 'FR';
          })
          .map((c) => {
            return JSON.stringify(c.data.tagline).length - 2
              ? c.data.tagline
              : tv.tagline;
          })[0],
        production_companies: tv.production_companies.map((c) => {
          return {
            name: c.name,
            logo_path: c.logo_path
              ? 'https://image.tmdb.org/t/p/w185' + c.logo_path
              : null,
          };
        }),
        director: tv.created_by.map((c) => {
          return {
            name: c.name,
            profile_path: c.profile_path
              ? 'https://image.tmdb.org/t/p/w185' + c.profile_path
              : null,
          };
        }),
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
          .map((c) => {
            return {
              index: c.season_number,
              name: c.name,
              episode_count: c.episode_count,
              overview: c.overview,
              poster_path: c.poster_path
                ? 'https://image.tmdb.org/t/p/w500' + c.poster_path
                : null,
              avaliable: false,
            };
          }),

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
                  username: c.author_details.username,
                  avatar_path: c.author_details.avatar_path,
                  rating: c.author_details.rating,
                },
                content: c.content,
              };
            })
          : null,
        trailer_key: tv.videos.results
          .filter((obj) => {
            return obj.type === 'Trailer' && obj.site === 'YouTube';
          })
          .map((c) => {
            return c.key;
          })[0],
        budget: tv.budget,
        revenue: tv.revenue,
      },
      mediaType: 'tv',
    };
  }

  async getMovie(tmdbId: string, lang = 'en-US'): Promise<MediaWithType> {
    const config = this.configService.get<TMDBConfig>('tmdb');

    const TMDBMovie = await firstValueFrom(
      this.httpService.get(
        `${config.apiUrl}/movie/${tmdbId}?api_key=${config.apiKey}&language=${lang}&append_to_response=videos,credits,translations,reviews`,
      ),
    );

    const movie = TMDBMovie.data;

    return {
      data: {
        TMDB_id: movie.id,
        title: movie.title,
        titleFr: movie.translations.translations
          .filter((obj) => {
            return obj.iso_3166_1 === 'FR';
          })
          .map((c) => {
            return JSON.stringify(c.data.title).length - 2
              ? c.data.title
              : movie.title;
          })[0],
        mediaType: 'movie',
        runtime: movie.runtime,
        budget: movie.budget,
        genres: movie.genres.map((g) => g.name),
        overview: movie.overview,
        overviewFR: movie.translations.translations
          .filter((obj) => {
            return obj.iso_3166_1 === 'FR';
          })
          .map((c) => {
            return JSON.stringify(c.data.overview).length - 2
              ? c.data.overview
              : movie.overview;
          })[0],
        popularity: movie.popularity,
        release_date: movie.release_date,
        revenue: movie.revenue,
        poster_path: movie.poster_path
          ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
          : null,
        backdrop_path: movie.backdrop_path
          ? 'https://image.tmdb.org/t/p/w1280' + movie.backdrop_path
          : null,
        tagline:
          JSON.stringify(movie.tagline).length - 2 ? movie.tagline : null,
        taglineFr: movie.translations.translations
          .filter((obj) => {
            return obj.iso_3166_1 === 'FR';
          })
          .map((c) => {
            return JSON.stringify(c.data.tagline).length - 2
              ? c.data.tagline
              : movie.tagline;
          })[0],
        production_companies: movie.production_companies.map((c) => {
          return {
            name: c.name,
            logo_path: c.logo_path
              ? 'https://image.tmdb.org/t/p/w185' + c.logo_path
              : null,
          };
        }),
        director: movie.credits.crew
          .filter((obj) => {
            return obj.job === 'Director';
          })
          .map((c) => {
            return {
              name: c.name,
              profile_path: c.profile_path
                ? 'https://image.tmdb.org/t/p/w185' + c.profile_path
                : null,
            };
          })[0],
        actors: movie.credits.cast.slice(0, 8).map((c) => {
          return {
            name: c.name,
            character: c.character,
            profile_path: c.profile_path
              ? 'https://image.tmdb.org/t/p/w185' + c.profile_path
              : null,
          };
        }),
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
                  username: c.author_details.username,
                  avatar_path: c.author_details.avatar_path,
                  rating: c.author_details.rating,
                },
                content: c.content,
              };
            })
          : null,
        trailer_key: movie.videos.results
          .filter((obj) => {
            return obj.type === 'Trailer' && obj.site === 'YouTube';
          })
          .map((c) => {
            return c.key;
          })[0],
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
