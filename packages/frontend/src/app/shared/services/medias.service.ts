import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MediaWithType } from '../models/media.model';

@Injectable({
  providedIn: 'root',
})
export class MediasService {
  constructor(private readonly http: HttpClient) {}

  getMedias() {
    return this.http.get<MediaWithType[]>('medias', { withCredentials: true });
  }
}
