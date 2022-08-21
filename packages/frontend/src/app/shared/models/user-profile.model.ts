import { PlayedMedia } from './played-media.model';
import { Media } from './media.model';
import { TMDBMicroSearchResult } from './micro-tmdb-search-result.model';

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
  mediasInList: Media[];
  likedMedias: Media[];
}
