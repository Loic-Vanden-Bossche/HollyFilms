import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MediaWithType } from '../models/media.model';
import { FileData } from '../models/file-data.model';
import { TMDBAdminSearchResult } from '../models/admin-tmdb-search-result.model';
import { User } from '../models/user.model';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  users = new BehaviorSubject<User[]>([]);
  medias = new BehaviorSubject<MediaWithType[]>([]);

  constructor(private readonly http: HttpClient) {}

  getMedias(query = '') {
    return this.http
      .get<MediaWithType[]>(`medias/adminSearch?query=${query}`, {
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

  onlineSearch(query = '') {
    return this.http.get<void>(`processing/onlineSearch?query=${query}`, {
      withCredentials: true,
    });
  }

  tmdbSearch(query = '', type: 'movie' | 'tv' | 'both' = 'both') {
    return this.http.get<TMDBAdminSearchResult[]>(
      `tmdb/search?type=${type}&query=${query}`,
      { withCredentials: true }
    );
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
      .pipe(tap((media) => this.medias.next([...this.medias.value, media])));
  }

  addTv(tmdbId: number) {
    return this.http.post<MediaWithType>(
      'tvs',
      { tmdbId },
      { withCredentials: true }
    );
  }
}
