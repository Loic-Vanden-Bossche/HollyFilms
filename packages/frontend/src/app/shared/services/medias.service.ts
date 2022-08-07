import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ListType,
  Media,
  MediaWithType,
  MediaWithTypeAndFeatured,
} from '../models/media.model';
import { AuthService } from './auth.service';

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

  getFeaturedMedias() {
    return this.http.get<MediaWithTypeAndFeatured[]>(`medias/featured`, {
      withCredentials: true,
    });
  }
}
