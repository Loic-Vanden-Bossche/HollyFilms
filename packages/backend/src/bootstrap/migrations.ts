import * as fsp from 'fs/promises';
import { Media } from '../medias/media.schema';
import { User } from '../indentity/users/user.schema';
import { Role } from '../shared/role';
import { getObjectId } from '../shared/mongoose';
import { getRandomColor } from '../indentity/users/colors-profiles';

import * as randomToken from 'rand-token';

export class Director {
  name: string;
  profile_path: string;
}

export class FileInfos {
  isProcessing: boolean;
  maxQualilty: number;
  audioLangAvaliables: Array<string>;
  maxQualiltyTag: string;
  Sduration: number;
  thumbnailsGenerated: boolean;
  extraQualities: Array<number>;
  location: string;
}

export class PlayedMovie {
  videoId: string;
  audioTrack: number;
  subtitleTrack: number;
  currentTime: number;
}

export class PlayerTvShow extends PlayedMovie {
  si: number;
  ei: number;
}

export class OldUser {
  _id: {
    $oid: string;
  };
  username: string;
  email: string;
  passwd: string;
  role: string;
  socialId: null;
  socialUser: boolean;
  playedMovies: PlayedMovie[];
  playedTvs: PlayerTvShow[];
}

export class Movie {
  _id: {
    $oid: string;
  };

  TMDB_id: number;

  title: string;

  titleFr: string;

  mediaType: string;

  runtime: number;

  budget: { $numberLong: string } | number;

  genres: Array<string>;

  overview: string;

  overviewFR: string;

  popularity: number;

  release_date: string;

  revenue: number | { $numberLong: string };

  poster_path: string;

  backdrop_path: string;

  tagline: string;

  taglineFr: string;

  production_companies: Array<{ name: string; logo_path: string }>;

  director: Director;

  actors: Array<{ name: string; character: string; profile_path: string }>;

  rating: number;

  reviews: Array<{
    author: { username: string; avatar_path: string; rating: number };
    content: string;
  }>;

  trailer_key: string;

  fileInfos: FileInfos;

  dateAdded: {
    $date: {
      $numberLong: string;
    };
  };
}

export class TVSeason {
  index: number;
  name: string;
  episode_count: number;
  overview: string;
  poster_path: string;
  avaliable: boolean;
  episodes: TVEpisode[];
  dateAdded: {
    $date: {
      $numberLong: string;
    };
  };
}

export class TVEpisode {
  name: string;
  index: number;
  overview: string;
  still_path: string;
  vote_average: number;
  avaliable: boolean;
  dateAdded: {
    $date: {
      $numberLong: string;
    };
  };
  fileInfos: FileInfos;
  runtime: number;
}

export class TVShow {
  _id: {
    $oid: string;
  };

  TMDB_id: number;

  title: string;

  titleFr: string;

  mediaType: string;

  runtime: number[];

  seasons: TVSeason[];

  number_of_episodes: number;

  number_of_seasons: number;

  status: string;

  genres: Array<string>;

  overview: string;

  overviewFR: string;

  popularity: number;

  release_date: string;

  poster_path: string;

  backdrop_path: string;

  tagline: string;

  taglineFr: string;

  production_companies: Array<{ name: string; logo_path: string }>;

  creator: Director | Director[];

  actors: Array<{ name: string; character: string; profile_path: string }>;

  rating: number;

  reviews: Array<{
    author: { username: string; avatar_path: string; rating: number };
    content: string;
  }>;

  trailer_key: string;

  dateAdded: {
    $date: {
      $numberLong: string;
    };
  };
}

const loadJsonFile = (path: string) =>
  fsp.readFile(path).then((data) => JSON.parse(data.toString()));

const loadMovies = () =>
  loadJsonFile('/apps/migrations/movies.json') as Promise<Movie[]>;

const loadTvs = () =>
  loadJsonFile('/apps/migrations/tvs.json') as Promise<TVShow[]>;

const loadUsers = () =>
  loadJsonFile('/apps/migrations/users.json') as Promise<OldUser[]>;

const oldToNewUser = (oldUser: OldUser): User => ({
  _id: oldUser._id.$oid,
  email: oldUser.email,
  password: oldUser.passwd,
  tokens: [],
  isRegisteredWithGoogle: false,
  roles: [Role.User],
  profiles: [
    {
      profileUniqueId: randomToken.generate(16),
      isDefault: true,
      firstname: oldUser.username,
      picture: null,
      lastname: oldUser.username,
      username: oldUser.username,
      color: getRandomColor(),
      playedMedias: [
        ...(oldUser.playedMovies
          ? oldUser.playedMovies.map((movie) => ({
              media: getObjectId(movie.videoId) as unknown as Media,
              audioTrack: movie.audioTrack,
              subtitleTrack: movie.subtitleTrack,
              currentTime: movie.currentTime,
            }))
          : []),
        ...(oldUser.playedTvs
          ? oldUser.playedTvs.map((tv) => ({
              media: getObjectId(tv.videoId) as unknown as Media,
              si: tv.si,
              ei: tv.ei,
              audioTrack: tv.audioTrack,
              subtitleTrack: tv.subtitleTrack,
              currentTime: tv.currentTime,
            }))
          : []),
      ],
    },
  ],
});

const movieToMedia = (movie: Movie): Media => ({
  _id: movie._id.$oid,
  TMDB_id: movie.TMDB_id,
  title: movie.titleFr,
  runtime: movie.runtime,
  budget:
    typeof movie.budget === 'number'
      ? movie.budget
      : parseInt(movie.budget?.$numberLong),
  genres: movie.genres,
  overview: movie.overviewFR,
  popularity: movie.popularity,
  release_date: movie.release_date,
  revenue:
    typeof movie.revenue === 'number'
      ? movie.revenue
      : parseInt(movie.revenue?.$numberLong),
  poster_path: movie.poster_path,
  backdrop_path: movie.backdrop_path,
  tagline: movie.taglineFr,
  production_companies: movie.production_companies,
  director: movie.director,
  actors: movie.actors,
  rating: movie.rating,
  reviews:
    movie.reviews?.map((review) => ({
      author: {
        name: review.author.username,
        profile_path: review.author.avatar_path,
      },
      content: review.content,
      rating: review.author.rating,
    })) || null,
  available: true,
  trailer_key: movie.trailer_key,
  fileInfos: {
    ...movie.fileInfos,
    audioLangAvailable: movie.fileInfos.audioLangAvaliables,
    maxQualityTag: movie.fileInfos.maxQualiltyTag,
    maxQuality: movie.fileInfos.maxQualilty,
  },
  createdAt: movie?.dateAdded?.$date.$numberLong
    ? new Date(parseInt(movie?.dateAdded?.$date.$numberLong))
    : new Date(),
});

const tvShowToMedia = (tvShow: TVShow): Media => ({
  _id: tvShow._id.$oid,
  TMDB_id: tvShow.TMDB_id,
  title: tvShow.titleFr,
  runtime: tvShow.runtime[0] || 0,
  genres: tvShow.genres,
  budget: 0,
  revenue: 0,
  overview: tvShow.overviewFR,
  popularity: tvShow.popularity,
  release_date: tvShow.release_date,
  poster_path: tvShow.poster_path,
  backdrop_path: tvShow.backdrop_path,
  tagline: tvShow.taglineFr,
  production_companies: tvShow.production_companies,
  director: Array.isArray(tvShow.creator) ? tvShow.creator[0] : tvShow.creator,
  actors: tvShow.actors,
  tvs: tvShow.seasons.map((season) => ({
    index: season.index,
    name: season.name,
    episode_count: season.episode_count,
    overview: season.overview,
    poster_path: season.poster_path,
    available: season.avaliable,
    dateAdded: season?.dateAdded?.$date.$numberLong
      ? new Date(parseInt(season?.dateAdded?.$date.$numberLong))
      : new Date(),
    episodes: season.episodes.map((episode) => ({
      name: episode.name,
      index: episode.index,
      overview: episode.overview,
      runtime: episode.runtime,
      queued: false,
      still_path: episode.still_path,
      vote_average: episode.vote_average,
      available: episode.avaliable,
      dateAdded: episode?.dateAdded?.$date.$numberLong
        ? new Date(parseInt(episode?.dateAdded?.$date.$numberLong))
        : new Date(),
      releaseDate: new Date(),
      fileInfos: episode.fileInfos
        ? {
            isProcessing: false,
            Sduration: episode.fileInfos.Sduration,
            thumbnailsGenerated: episode.fileInfos.thumbnailsGenerated,
            extraQualities: episode.fileInfos.extraQualities,
            location: episode.fileInfos.location,
            audioLangAvailable: episode.fileInfos.audioLangAvaliables,
            maxQualityTag: episode.fileInfos.maxQualiltyTag,
            maxQuality: episode.fileInfos.maxQualilty,
          }
        : undefined,
    })),
  })),
  rating: tvShow.rating,
  reviews:
    tvShow.reviews?.map((review) => ({
      author: {
        name: review.author.username,
        profile_path: review.author.avatar_path,
      },
      content: review.content,
      rating: review.author.rating,
    })) || null,
  available: true,
  trailer_key: tvShow.trailer_key,
  createdAt: tvShow?.dateAdded?.$date.$numberLong
    ? new Date(parseInt(tvShow?.dateAdded?.$date.$numberLong))
    : new Date(),
});

export const getUsersToMigrate = () => {
  return loadUsers().then((users) => users.map(oldToNewUser));
};

export const getTvsToMigrate = () => {
  return loadTvs().then((movies) => movies.map(tvShowToMedia));
};

export const getMoviesToMigrate = () => {
  return loadMovies().then((movies) => movies.map(movieToMedia));
};
