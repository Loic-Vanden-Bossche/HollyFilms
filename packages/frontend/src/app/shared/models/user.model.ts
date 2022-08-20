import { PlayedMedia } from './played-media.model';
import { UserProfile } from './user-profile.model';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export interface UpdateUserDTO {
  firstname: string;
  lastname: string;
  username: string;
}

export interface User extends UserProfile {
  _id: string;
  email: string;
  isAdmin?: boolean;
  isActivated?: boolean;
  playedMedias: PlayedMedia[];
}
