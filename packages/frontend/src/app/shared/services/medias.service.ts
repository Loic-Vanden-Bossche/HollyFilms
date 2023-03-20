import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FeaturedType,
  ListType,
  Media,
  MediaCategory,
  MediaWithType,
  MediaWithTypeAndFeatured,
  ShowcaseMedia,
} from '../models/media.model';
import { AuthService } from './auth.service';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { MediaRecord } from '../models/user-profile.model';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '../models/notification.model';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowTrendUp,
  faBolt,
  faCirclePlay,
  faLightbulb,
  faList,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import { TvsService } from './tvs.service';
import { fromSecondsToTime } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class MediasService {
  limit = 10;

  selectedMedia = new BehaviorSubject<MediaWithType | null>(null);

  private _inListChanged$ = new Subject<void>();

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
    private readonly tvsService: TvsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  getPlayLabelForMedia(media: MediaWithType) {
    if (media?.mediaType === 'tv') {
      const indexes = this.tvsService.getTvClosestIndexes(media.data);

      if (indexes) {
        return `S${indexes.seasonIndex} E${indexes.episodeIndex}`;
      }

      return 'Commencer';
    }

    const watchedTime = this.getMovieWatchedTime(media.data);

    if (watchedTime) {
      const movieDuration = this.getMovieDuration(media.data);
      if (watchedTime > movieDuration * 0.9) {
        return 'Revoir';
      }
      return `Continuer - ${fromSecondsToTime(watchedTime)}`;
    }

    return 'Voir le film';
  }

  onInListChanged() {
    return this._inListChanged$.asObservable();
  }

  clearSelectedMedia() {
    this.selectedMedia.next(null);
  }

  selectMedia(media: MediaWithType) {
    this.selectedMedia.next(media);
  }

  getMovieDuration(media: Media) {
    return media.fileInfos?.Sduration || 0;
  }

  getTagAndIconFromFeatured(
    featured: FeaturedType | undefined,
  ): [string, IconDefinition] {
    switch (featured) {
      case FeaturedType.CONTINUE:
        return [
          'Vous avez commencé ce film, continuer la lecture ?',
          faCirclePlay,
        ];
      case FeaturedType.INLIST:
        return ['Ceci est dans votre liste', faList];
      case FeaturedType.POPULAR:
        return ['Très populaire sur HollyFilms', faArrowTrendUp];
      case FeaturedType.RECENT:
        return ['Nouveau sur HollyFilms', faBolt];
      case FeaturedType.RECOMMENDED:
        return ['Recommandé pour vous', faUserCheck];
      default:
        return ['Proposition originale', faLightbulb];
    }
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
        }),
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
        }),
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
          this._inListChanged$.next();
          this.notificationsService.push({
            type: NotificationType.Success,
            message: `${media.data.title} a été ajouté à votre liste`,
          });
        }),
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
          this._inListChanged$.next();
          this.notificationsService.push({
            type: NotificationType.Info,
            message: `${media.data.title} a été retiré de votre liste`,
          });
        }),
      );
  }

  getMedias(type: ListType = ListType.ALL, skip = 0) {
    return this.http.get<MediaWithType[]>(
      `medias?type=${type}&limit=${this.limit}&skip=${skip}`,
      { withCredentials: true },
    );
  }

  getMediasByCategory(category: string[]) {
    return this.http.get<MediaWithType[]>(
      `medias/category/${category.join('/')}`,
      {
        withCredentials: true,
      },
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
      { withCredentials: true },
    );
  }

  searchQuery(query: string, all: boolean, skip = 0) {
    return this.http.get<MediaWithType[]>(
      `medias/search?query=${query}&limit=${all ? 0 : this.limit}&skip=${skip}`,
      { withCredentials: true },
    );
  }

  getMedia(mediaId: string) {
    return this.http.get<MediaWithType>(`medias/${mediaId}`, {
      withCredentials: true,
    });
  }

  getMovieWatchedTime(media: Media) {
    return (
      this.auth.user?.playedMedias.find((pm) => pm.mediaId === media._id)
        ?.currentTime || 0
    );
  }

  getFeaturedMedias() {
    return this.http.get<MediaWithTypeAndFeatured[]>(`medias/featured`, {
      withCredentials: true,
    });
  }
}
