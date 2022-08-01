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

  getMovieWatchedTime(media: Media) {
    return (
      this.auth.user.playedMedias.find((pm) => pm.media._id === media._id)
        ?.currentTime || 0
    );
  }
}
