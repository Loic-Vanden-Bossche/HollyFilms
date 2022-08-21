import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MediaWithType, MediaWithTypeAndQueue } from '../models/media.model';
import { FileData } from '../models/file-data.model';
import { User } from '../models/user.model';
import { BehaviorSubject, tap } from 'rxjs';
import { ProgressStatus } from './processing.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  users = new BehaviorSubject<User[]>([]);
  medias = new BehaviorSubject<MediaWithTypeAndQueue[]>([]);

  refreshMediaList = new EventEmitter<void>();

  constructor(private readonly http: HttpClient) {}

  refreshMedias() {
    this.refreshMediaList.emit();
  }

  getMedias(query = '') {
    return this.http
      .get<MediaWithTypeAndQueue[]>(`medias/adminSearch?query=${query}`, {
        withCredentials: true,
      })
      .pipe(tap((medias) => this.medias.next(medias)));
  }

  getUsers() {
    return this.http
      .get<User[]>('users/admin', { withCredentials: true })
      .pipe(tap((users) => this.users.next(users)));
  }

  localSearch(query = '') {
    return this.http.get<FileData[]>(`processing/localSearch?query=${query}`, {
      withCredentials: true,
    });
  }

  getQueueLength(media: MediaWithTypeAndQueue[]) {
    return media.filter((m) => m.queue).length;
  }

  getInitialData() {
    return this.http.get<{
      progressStatus: ProgressStatus;
      queueStarted: boolean;
    }>('processing/initialData', { withCredentials: true });
  }

  startQueue() {
    return this.http.get('processing/startQueue', { withCredentials: true });
  }

  stopQueue() {
    return this.http.get('processing/stopQueue', { withCredentials: true });
  }

  removeFromQueue(videoId: string) {
    return this.http.delete(`processing/removeFromQueue/${videoId}`, {
      withCredentials: true,
    });
  }

  updateAllMedias() {
    return this.http.get('medias/updateAll', { withCredentials: true });
  }

  deleteMedia(id: string) {
    return this.http
      .delete(`medias/${id}`, { withCredentials: true })
      .pipe(tap(() => this.refreshMedias()));
  }

  clearQueue() {
    return this.http
      .get<{ needRefresh: boolean }>('processing/clearQueue', {
        withCredentials: true,
      })
      .pipe(tap(() => this.refreshMedias()));
  }

  onlineSearch(query = '') {
    return this.http.get<void>(`processing/onlineSearch?query=${query}`, {
      withCredentials: true,
    });
  }

  addMovie(tmdbId: number, filePath: string) {
    return this.http
      .post<MediaWithType>(
        'movies',
        {
          tmdbId,
          filePath,
        },
        { withCredentials: true }
      )
      .pipe(tap(() => this.refreshMedias()));
  }

  addTv(tmdbId: number) {
    return this.http
      .post<MediaWithType>('tvs', { tmdbId }, { withCredentials: true })
      .pipe(tap(() => this.refreshMedias()));
  }
}
