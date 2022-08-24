import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PlayedMedia } from '../models/played-media.model';
import { MediaWithType } from '../models/media.model';
import { TvsService } from './tvs.service';

export interface PlayData {
  mediaId: string;
  x: number;
  y: number;
  seasonIndex?: number;
  episodeIndex?: number;
}

export interface TrackData {
  mediaId: string;
  time?: number;
  ai?: number;
  ti?: number;
  si?: number;
  ei?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  playerData: PlayData | null = null;

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly tvsService: TvsService
  ) {}

  play(data: PlayData) {
    this.playerData = data;
  }

  autoPlay(media: MediaWithType, x: number, y: number) {
    this.play(this.getPlayDataFromMedia(media, x, y));
  }

  track(data: TrackData) {
    return this.http.get(
      `users/track?${new URLSearchParams(data as any).toString()}`,
      {
        withCredentials: true,
      }
    );
  }

  getPlayerStatus(mediaId: string, si?: number, ei?: number) {
    return this.http.get<PlayedMedia>(
      `users/playerStatus?${new URLSearchParams({
        mediaId,
        ...(si && ei ? { si, ei } : {}),
      } as any).toString()}`,
      {
        withCredentials: true,
      }
    );
  }

  getPlayDataFromMedia(media: MediaWithType, x: number, y: number): PlayData {
    if (media?.mediaType === 'tv') {
      const indexes = this.tvsService.getTvClosestIndexes(media.data);

      if (indexes) {
        return {
          seasonIndex: indexes.seasonIndex,
          episodeIndex: indexes.episodeIndex,
          mediaId: media.data._id,
          x,
          y,
        };
      }

      return { mediaId: media.data._id, seasonIndex: 0, episodeIndex: 0, x, y };
    }

    return { mediaId: media.data._id, x, y };
  }

  navigate() {
    if (this.playerData) {
      const { seasonIndex, episodeIndex, mediaId } = this.playerData;
      this.router.navigate([
        '/play',
        mediaId,
        ...(seasonIndex && episodeIndex ? [seasonIndex, episodeIndex] : []),
      ]);
    }
    this.playerData = null;
  }
}
