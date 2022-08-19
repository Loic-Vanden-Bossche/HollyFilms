import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ListType,
  Media,
  MediaCategory,
  MediaWithType,
  MediaWithTypeAndFeatured,
  ShowcaseMedia,
} from '../models/media.model';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediasService {
  limit = 10;

  selectedMedia = new BehaviorSubject<MediaWithType | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService
  ) {}

  clearSelectedMedia() {
    this.selectedMedia.next(null);
  }

  selectMedia(media: MediaWithType) {
    this.selectedMedia.next(media);
  }

  getMedias(type: ListType = ListType.ALL, skip = 0) {
    return this.http.get<MediaWithType[]>(
      `medias?type=${type}&limit=${this.limit}&skip=${skip}`,
      { withCredentials: true }
    );
  }

  getMediasByCategory(category: string[]) {
    return this.http.get<MediaWithType[]>(
      `medias/category/${category.join('/')}`,
      {
        withCredentials: true,
      }
    );
  }

  getCategories() {
    return this.http.get<MediaCategory[]>(`medias/categories`, {
      withCredentials: true,
    });
  }

  getShowCaseMedias() {
    return this.http.get<ShowcaseMedia[]>(`medias/showcase`, {
      withCredentials: true,
    });
  }

  getAllMedias(type: ListType = ListType.ALL) {
    return this.http.get<MediaWithType[]>(
      `medias?type=${type}&limit=${0}&skip=${0}`,
      { withCredentials: true }
    );
  }

  searchQuery(query: string, all: boolean, skip = 0) {
    return this.http.get<MediaWithType[]>(
      `medias/search?query=${query}&limit=${all ? 0 : this.limit}&skip=${skip}`,
      { withCredentials: true }
    );
  }

  getMedia(mediaId: string) {
    return this.http.get<MediaWithType>(`medias/${mediaId}`, {
      withCredentials: true,
    });
  }

  getMovieWatchedTime(media: Media) {
    return (
      this.auth.user?.playedMedias.find((pm) => pm.media?._id === media._id)
        ?.currentTime || 0
    );
  }

  getFeaturedMedias() {
    return this.http.get<MediaWithTypeAndFeatured[]>(`medias/featured`, {
      withCredentials: true,
    });
  }
}
