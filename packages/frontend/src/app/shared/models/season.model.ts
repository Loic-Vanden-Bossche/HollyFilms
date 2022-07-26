import { Episode } from './episode.model';

export interface Season {
  index: number;
  name: string;
  episode_count: number;
  overview: string;
  poster_path: string;
  available: boolean;
  dateAdded?: Date;
  episodes?: Episode[];
}
