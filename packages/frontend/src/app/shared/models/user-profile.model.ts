import { PlayedMedia } from './played-media.model';
import { TMDBMicroSearchResult } from './micro-tmdb-search-result.model';

export interface MediaRecord {
  mediaId: string;
  createdAt: Date;
}

export interface UserProfile {
  color: string;
  isDefault: boolean;
  picture: string | null;
  profileUniqueId: string;
  firstname: string;
  lastname: string;
  username: string;
  playedMedias: PlayedMedia[];
  addRequestedMedias?: TMDBMicroSearchResult[];
  mediasInList: MediaRecord[];
  likedMedias: MediaRecord[];
}
