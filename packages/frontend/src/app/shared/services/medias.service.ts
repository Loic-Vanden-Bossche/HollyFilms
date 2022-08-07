import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Media, MediaWithType } from '../models/media.model';
import { AuthService } from './auth.service';

export enum ListType {
  ALL = '',
  POPULAR = 'popular',
  RECENT = 'recent',
  INLIST = 'inlist',
  LIKED = 'liked',
  WATCHED = 'watched',
  CONTINUED = 'continue',
}

@Injectable({
  providedIn: 'root',
})
export class MediasService {
  limit = 10;

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService
  ) {}

  getMedias(type: ListType = ListType.ALL, skip = 0) {
    return this.http.get<MediaWithType[]>(
      `medias?type=${type}&limit=${this.limit}&skip=${skip}`,
      { withCredentials: true }
    );
  }

  searchQuery(query: string, skip = 0) {
    return this.http.get<MediaWithType[]>(
      `medias/search?query=${query}&limit=${this.limit}&skip=${skip}`
    );
  }

  getMedia(mediaId: string) {
    return this.http.get<MediaWithType>(`medias/${mediaId}`, {
      withCredentials: true,
    });
  }

  getMovieWatchedTime(media: Media) {
    return (
      this.auth.user.playedMedias.find((pm) => pm.media?._id === media._id)
        ?.currentTime || 0
    );
  }
}
