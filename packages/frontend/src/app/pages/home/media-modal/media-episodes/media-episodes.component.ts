import { Component, Input, OnInit } from '@angular/core';
import { Season } from '../../../../shared/models/season.model';

@Component({
  selector: 'app-media-episodes',
  templateUrl: './media-episodes.component.html',
})
export class MediaEpisodesComponent implements OnInit {
  @Input() seasons: Season[] = [];

  selectedSeasonIndex: number | null = null;

  selectDefaultSeason() {
    console.log(this.seasons);
    for (const [i, season] of this.seasons.entries()) {
      if (season.available) {
        return i;
      }
    }
    return null;
  }

  ngOnInit(): void {
    this.selectedSeasonIndex = this.selectDefaultSeason();
  }
}
