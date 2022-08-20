import { PlayedMedia } from './played-media.model';

export interface UserProfile {
  color: string;
  profileUniqueId: string;
  firstname: string;
  lastname: string;
  username: string;
  playedMedias: PlayedMedia[];
}
