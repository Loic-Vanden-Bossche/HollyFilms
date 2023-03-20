import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MediaWithType, MediaWithTypeAndQueue } from '../models/media.model';
import { FileData } from '../models/file-data.model';
import { User } from '../models/user.model';
import { BehaviorSubject, map, tap } from 'rxjs';
import { ProgressStatus } from './processing.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  users: User[] = [];
  medias: MediaWithTypeAndQueue[] = [];

  private _filteredUsers$ = new BehaviorSubject<User[]>([]);
  private _filteredMedias$ = new BehaviorSubject<MediaWithTypeAndQueue[]>([]);

  get filteredUsers() {
    return this._filteredUsers$.asObservable();
  }

  get filteredMedias() {
    return this._filteredMedias$
      .asObservable()
      .pipe(map((medias) => medias.slice(1)));
  }

  get firstFilteredMedia() {
    return this._filteredMedias$
      .asObservable()
      .pipe(map((medias) => medias[0] || null));
  }

  refreshMediaList = new EventEmitter<void>();

  constructor(
    private readonly http: HttpClient,
    private readonly usersService: UsersService,
  ) {}

  refreshMedias() {
    this.refreshMediaList.emit();
  }

  getMedias() {
    return this.http
      .get<MediaWithTypeAndQueue[]>(`medias/admin`, {
        withCredentials: true,
      })
      .pipe(
        tap((medias) => (this.medias = medias)),
        tap(() => this.filterMedias()),
      );
  }

  filterMedias(query = '') {
    this._filteredMedias$.next(
      this.medias.filter(
        (m) => m.data.title.toLowerCase().includes(query) || m.queue?.length,
      ),
    );
  }

  getUsers() {
    return this.http.get<User[]>('users/admin', { withCredentials: true }).pipe(
      tap((users) => (this.users = users)),
      tap(() => this.filterUsers()),
    );
  }

  filterUsers(query = '') {
    this._filteredUsers$.next(
      this.sortUsers(
        this.users.filter(
          (u) =>
            u.username.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.firstname.toLowerCase().includes(query) ||
            u.lastname.toLowerCase().includes(query),
        ),
      ),
    );
  }

  sortUsers(users: User[]): User[] {
    return users.sort((a, b) => {
      if (a.isAdmin) {
        return -1;
      } else if (b.isAdmin) {
        return 1;
      } else if (!a.isActivated) {
        return -1;
      } else if (!b.isActivated) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  localSearch(query = '') {
    return this.http.get<FileData[]>(`processing/localSearch?query=${query}`, {
      withCredentials: true,
    });
  }

  deleteUser(userId: string) {
    return this.usersService.deleteUser(userId).pipe(
      tap(() => (this.users = this.users.filter((u) => u._id !== userId))),
      tap(() => this.filterUsers()),
    );
  }

  validateUser(userId: string) {
    return this.usersService.validateUser(userId).pipe(
      tap(
        () =>
          (this.users = this.users.map((u) =>
            u._id === userId ? { ...u, isActivated: true } : u,
          )),
      ),
      tap(() => this.filterUsers()),
    );
  }

  onDeleted(userId: string): void {
    this.usersService.deleteUser(userId).pipe(
      tap(() => (this.users = this.users.filter((u) => u._id !== userId))),
      tap(() => this.filterUsers()),
    );
  }

  getQueueLength() {
    return this.medias.filter((m) => m.queue).length;
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
        { withCredentials: true },
      )
      .pipe(tap(() => this.refreshMedias()));
  }

  addTv(tmdbId: number) {
    return this.http
      .post<MediaWithType>('tvs', { tmdbId }, { withCredentials: true })
      .pipe(tap(() => this.refreshMedias()));
  }
}
