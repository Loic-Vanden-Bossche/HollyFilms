import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface PlayData {
  mediaId: string;
  x: number;
  y: number;
  seasonIndex?: number;
  episodeIndex?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  playerData: PlayData | null = null;

  constructor(private readonly router: Router) {}

  play(data: PlayData) {
    this.playerData = data;
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
