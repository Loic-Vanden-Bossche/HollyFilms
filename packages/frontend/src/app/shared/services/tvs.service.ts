import { Injectable } from '@angular/core';
import { Media } from '../models/media.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TvsService {
  watchedThreshold = 120;

  constructor(private readonly auth: AuthService) {}

  isTvWatched(media: Media) {
    return this.auth.user.playedMedias
      .filter((pm) => pm.media === media)
      .some((pm) => pm.currentTime > this.watchedThreshold);
  }

  getEpisodeWatchedTime(
    mediaId: string,
    episodeIndex: number,
    seasonIndex: number
  ): number {
    return (
      this.auth.user.playedMedias.find(
        (pm) =>
          pm.media?._id === mediaId &&
          pm.seasonIndex === seasonIndex &&
          pm.episodeIndex === episodeIndex
      )?.currentTime || 0
    );
  }

  getTvClosestIndexes(
    media: Media
  ): { episodeIndex: number; seasonIndex: number } | null {
    if (!this.isTvWatched(media)) {
      return null;
    }

    let seasonIndex = 0;
    let episodeIndex = 0;

    this.auth.user.playedMedias
      .filter((pm) => pm.media._id === media._id)
      .forEach((pm) => {
        if (pm.seasonIndex !== undefined && pm.episodeIndex !== undefined) {
          if (pm.seasonIndex > seasonIndex) {
            seasonIndex = pm.seasonIndex;
            episodeIndex = pm.episodeIndex;
          } else if (
            pm.seasonIndex === seasonIndex &&
            pm.episodeIndex > episodeIndex
          ) {
            episodeIndex = pm.episodeIndex;
          }
        }
      });

    return { seasonIndex, episodeIndex };
  }
}
