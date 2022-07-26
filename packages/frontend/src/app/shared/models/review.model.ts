import { Profile } from './profile.model';

export interface Review {
  author: Profile;
  rating: number;
  content: string;
}
