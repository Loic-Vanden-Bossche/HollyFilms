import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MediaWithType } from '../models/media.model';
import { FileData } from '../models/file-data.model';
import { TMDBAdminSearchResult } from '../models/admin-tmdb-search-result.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private readonly http: HttpClient) {}

  getMedias(query = '') {
    return this.http.get<MediaWithType[]>(`adminSearch/${query}`);
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

  tmdbSearch(query = '') {
    return this.http.get<TMDBAdminSearchResult[]>(
      `tmdb/search?query=${query}`,
      { withCredentials: true }
    );
  }

  addMovie(tmdbId: number, filePath: string) {
    return this.http.post<MediaWithType>(
      'movies',
      {
        tmdbId,
        filePath,
      },
      { withCredentials: true }
    );
  }
}
