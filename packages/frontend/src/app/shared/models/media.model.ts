import { FileInfos } from './file-infos.model';
import { Profile } from './profile.model';
import { Actor } from './actor.model';
import { Season } from './season.model';
import { Review } from './review.model';

export interface Media {
  TMDB_id: number;
  title: string;
  mediaType: string;
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
