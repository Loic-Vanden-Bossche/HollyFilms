import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Media, MediaWithType } from '../models/media.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MediasService {
  watchedThreshold = 120;

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService
  ) {}

  getMedias() {
    return this.http.get<MediaWithType[]>('medias', { withCredentials: true });
  }

  getMedia(mediaId: string) {
    return this.http.get<MediaWithType>(`medias/${mediaId}`, {
      withCredentials: true,
    });
  }

  isTvWatched(media: Media) {
    return this.auth.user.playedMedias
      .filter((pm) => pm.media === media)
      .some((pm) => pm.currentTime > this.watchedThreshold);
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

  getMovieWatchedTime(media: Media) {
    return (
      this.auth.user.playedMedias.find((pm) => pm.media._id === media._id)
        ?.currentTime || 0
    );
  }
}
