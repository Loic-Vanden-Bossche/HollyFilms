import { Component, Input, OnInit } from '@angular/core';
import { Season } from '../../../../shared/models/season.model';
import {TvsService} from "../../../../shared/services/tvs.service";

@Component({
  selector: 'app-media-episodes',
  templateUrl: './media-episodes.component.html',
})
export class MediaEpisodesComponent implements OnInit {
  @Input() mediaId: string = '';
  @Input() seasons: Season[] = [];

  seasonsWithWatchedTime: Season[] = [];

  selectedSeasonIndex: number | null = null;

  constructor(private readonly tvsService: TvsService) {}

  selectDefaultSeason() {
    for (const [i, season] of this.seasons.entries()) {
      if (season.available) {
        return i;
      }
    }
    return null;
  }

  calculateWatchedTime() {
    this.seasonsWithWatchedTime = this.seasons.map((season) => ({...season, episodes: season.episodes?.map(episode => ({...episode, watchedTime: this.tvsService.getEpisodeWatchedTime(this.mediaId, episode.index, season.index)}))}));
  }

  ngOnInit(): void {
    this.calculateWatchedTime();
    this.selectedSeasonIndex = this.selectDefaultSeason();
  }
}
