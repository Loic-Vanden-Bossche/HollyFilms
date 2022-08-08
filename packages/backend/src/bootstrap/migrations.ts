import * as fsp from 'fs/promises';
import { Media } from '../medias/media.schema';

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
}

const loadJsonFile = (path: string) =>
  fsp.readFile(path).then((data) => JSON.parse(data.toString()));

const loadMovies = () => loadJsonFile('./movies.json') as Promise<Movie[]>;

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
  fileInfos: movie.fileInfos,
});

export const getMoviesToMigrate = () => {
  return loadMovies().then((movies) => movies.map(movieToMedia));
};
