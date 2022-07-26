import { Media } from './media.model';

export interface PlayedMedia {
  media: Media;
  currentTime: number;
  seasonIndex?: number;
  episodeIndex?: number;
  audioTrack: number;
  subtitleTrack: number;
}
