import { PlayedMedia } from './played-media.model';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export interface UpdateUserDTO {
  firstname: string;
  lastname: string;
  username: string;
}

export interface User {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  isAdmin?: boolean;
  profileUniqueId: string;
  isActivated?: boolean;
  playedMedias: PlayedMedia[];
}
