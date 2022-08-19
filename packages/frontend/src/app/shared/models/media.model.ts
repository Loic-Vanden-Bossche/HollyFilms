import { FileInfos } from './file-infos.model';
import { Profile } from './profile.model';
import { Actor } from './actor.model';
import { Season } from './season.model';
import { Review } from './review.model';

export type MediaType = 'movie' | 'tv';
export type QueueData = {
  _id: string;
  filePath: string;
  seasonIndex?: number;
  episodeIndex?: number;
  dateAdded: Date;
};
export type MediaWithType = { data: Media; mediaType: MediaType };
export type MediaWithTypeAndQueue = MediaWithType & { queue?: QueueData[] };
export type MediaWithTypeAndFeatured = MediaWithType & {
  featured: FeaturedType;
};

export interface MediaCategory {
  name: string;
  count: number;
}

export enum ListType {
  ALL = '',
  RECOMMENDED = 'recommended',
  POPULAR = 'popular',
  RECENT = 'recent',
  INLIST = 'inlist',
  LIKED = 'liked',
  WATCHED = 'watched',
  CONTINUE = 'continue',
  MOVIE = 'movie',
  SERIES = 'series',
  ANIME = 'anime',
}

export enum FeaturedType {
  RECOMMENDED = 'recommended',
  POPULAR = 'popular',
  RECENT = 'recent',
  CONTINUE = 'continue',
  INLIST = 'inlist',
}

export interface ShowcaseMedia {
  _id: string;
  title: string;
  poster_path: string;
  backdrop_path: string;
  selected: boolean;
  mediaType: MediaType;
  audioLangAvailable: string[];
}

export interface Media {
  _id: string;
  TMDB_id: number;
  title: string;
  runtime: number;
  budget: number;
  genres: string[];
  overview: string;
  popularity: number;
  release_date: string;
  revenue: number;
  poster_path: string;
  backdrop_path: string;
  tagline: string;
  production_companies: Array<{ name: string; logo_path: string }>;
  director: Profile;
  actors: Actor[];
  rating: number;
  reviews: Review[];
  trailer_key: string;
  tvs?: Season[];
  fileInfos?: FileInfos;
}
