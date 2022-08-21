import { PlayedMedia } from './played-media.model';
import { Media } from './media.model';

export interface UserProfile {
  color: string;
  isDefault: boolean;
  picture: string | null;
  profileUniqueId: string;
  firstname: string;
  lastname: string;
  username: string;
  playedMedias: PlayedMedia[];
  mediasInList: Media[];
  likedMedias: Media[];
}
