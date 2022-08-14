import { Component, Input, OnInit } from '@angular/core';
import { Season } from '../../../shared/models/season.model';
import { TvsService } from '../../../shared/services/tvs.service';
import { PlayerService } from '../../../shared/services/player.service';

@Component({
  selector: 'app-media-episodes',
  templateUrl: './media-episodes.component.html',
})
export class MediaEpisodesComponent implements OnInit {
  @Input() mediaId = '';
  @Input() seasons: Season[] = [];

  seasonsWithWatchedTime: Season[] = [];

  selectedSeasonIndex: number | null = null;

  constructor(
    private readonly tvsService: TvsService,
    private readonly playerService: PlayerService
  ) {}

  onPlayEpisode(event: MouseEvent, seasonIndex: number, episodeIndex: number) {
    this.playerService.play({
      mediaId: this.mediaId,
      x: event.clientX,
      y: event.clientY,
      seasonIndex,
      episodeIndex,
    });
  }

  selectDefaultSeason() {
    for (const [i, season] of this.seasons.entries()) {
      if (season.available) {
        return i;
      }
    }
    return null;
  }

  calculateWatchedTime() {
    return this.seasons.map((season) => ({
      ...season,
      episodes: season.episodes?.map((episode) => ({
        ...episode,
        watchedTime: this.tvsService.getEpisodeWatchedTime(
          this.mediaId,
          episode.index,
          season.index
        ),
      })),
    }));
  }

  ngOnInit(): void {
    this.seasonsWithWatchedTime = this.calculateWatchedTime();
    this.selectedSeasonIndex = this.selectDefaultSeason();
  }
}
