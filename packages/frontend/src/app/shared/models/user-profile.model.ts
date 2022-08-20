import { PlayedMedia } from './played-media.model';

export interface UserProfile {
  uniqueId: string;
  firstname: string;
  lastname: string;
  username: string;
  playedMedias: PlayedMedia[];
}
