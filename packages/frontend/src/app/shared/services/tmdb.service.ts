import { Injectable } from '@angular/core';
import { TMDBMicroSearchResult } from '../models/micro-tmdb-search-result.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  constructor(private readonly http: HttpClient) {}

  search(query = '', type: 'movie' | 'tv' | 'both' = 'both') {
    return this.http.get<TMDBMicroSearchResult[]>(
      `tmdb/search?type=${type}&query=${query}`,
      { withCredentials: true }
    );
  }
}
