import { Injectable } from '@angular/core';
import { Media } from '../models/media.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TvsService {
  constructor(private readonly auth: AuthService) {}

  isTvWatched(mediaId: string) {
    return this.auth.user?.playedMedias
      .filter((pm) => pm.mediaId === mediaId)
      .some((pm) => pm.currentTime > 0);
  }

  getEpisodeWatchedTime(
    mediaId: string,
    episodeIndex: number,
    seasonIndex: number
  ): number {
    return (
      this.auth.user?.playedMedias.find(
        (pm) =>
          pm.mediaId === mediaId &&
          pm.seasonIndex === seasonIndex &&
          pm.episodeIndex === episodeIndex
      )?.currentTime || 0
    );
  }

  getTvClosestIndexes(
    media: Media
  ): { episodeIndex: number; seasonIndex: number } | null {
    if (!this.isTvWatched(media._id)) {
      return null;
    }

    let seasonIndex = 0;
    let episodeIndex = 0;

    this.auth.user?.playedMedias
      .filter((pm) => pm.mediaId === media._id)
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

    if (seasonIndex === 0 || episodeIndex === 0) {
      return null;
    }

    return { seasonIndex, episodeIndex };
  }
}
