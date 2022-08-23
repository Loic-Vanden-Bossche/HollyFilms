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
import { BehaviorSubject, tap } from 'rxjs';
import { MediaRecord } from '../models/user-profile.model';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class MediasService {
  limit = 10;

  selectedMedia = new BehaviorSubject<MediaWithType | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
    private readonly notificationsService: NotificationsService
  ) {}

  clearSelectedMedia() {
    this.selectedMedia.next(null);
  }

  selectMedia(media: MediaWithType) {
    this.selectedMedia.next(media);
  }

  likeMedia(media: MediaWithType) {
    return this.http
      .get<MediaRecord[]>(`users/like/${media.data._id}`, {
        withCredentials: true,
      })
      .pipe(
        tap((likedMedias) => {
          this.auth.updateUserProfile({ likedMedias });
          this.notificationsService.push({
            type: NotificationType.Success,
            message: `J\' aime ajouté pour ${media.data.title}`,
          });
        })
      );
  }

  unlikeMedia(media: MediaWithType) {
    return this.http
      .get<MediaRecord[]>(`users/unlike/${media.data._id}`, {
        withCredentials: true,
      })
      .pipe(
        tap((likedMedias) => {
          this.auth.updateUserProfile({ likedMedias });
          this.notificationsService.push({
            type: NotificationType.Info,
            message: `Vous n\'aimez plus ${media.data.title}`,
          });
        })
      );
  }

  addInList(media: MediaWithType) {
    return this.http
      .get<MediaRecord[]>(`users/addToList/${media.data._id}`, {
        withCredentials: true,
      })
      .pipe(
        tap((mediasInList) => {
          this.auth.updateUserProfile({ mediasInList });
          this.notificationsService.push({
            type: NotificationType.Success,
            message: `${media.data.title} a été ajouté à votre liste`,
          });
        })
      );
  }

  removeFromList(media: MediaWithType) {
    return this.http
      .get<MediaRecord[]>(`users/removeFromList/${media.data._id}`, {
        withCredentials: true,
      })
      .pipe(
        tap((mediasInList) => {
          this.auth.updateUserProfile({ mediasInList });
          this.notificationsService.push({
            type: NotificationType.Info,
            message: `${media.data.title} a été retiré de votre liste`,
          });
        })
      );
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
