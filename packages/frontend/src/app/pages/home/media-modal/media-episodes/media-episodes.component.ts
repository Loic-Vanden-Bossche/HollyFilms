import { Component, Input, OnInit } from '@angular/core';
import { Season } from '../../../../shared/models/season.model';

@Component({
  selector: 'app-media-episodes',
  templateUrl: './media-episodes.component.html',
})
export class MediaEpisodesComponent implements OnInit {
  @Input() seasons: Season[] = [];

  selectedSeasonIndex: number = 0;

  ngOnInit(): void {}
}
