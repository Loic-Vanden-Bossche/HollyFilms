import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PlayedMedia } from '../models/played-media.model';

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
    private readonly http: HttpClient
  ) {}

  play(data: PlayData) {
    this.playerData = data;
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
