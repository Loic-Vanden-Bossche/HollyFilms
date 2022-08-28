export interface PlayedMedia {
  mediaId: string;
  currentTime: number;
  seasonIndex?: number;
  episodeIndex?: number;
  audioTrack: number;
  subtitleTrack: number;
  createdAt: Date;
  updatedAt: Date;
}
