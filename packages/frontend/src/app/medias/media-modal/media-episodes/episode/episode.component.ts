import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Episode } from '../../../../shared/models/episode.model';
import * as dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { TvsService } from '../../../../shared/services/tvs.service';
dayjs.locale('fr');

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
})
export class EpisodeComponent implements OnInit {
  @Input() episode: Episode | null = null;
  @Output() play = new EventEmitter<MouseEvent>();

  releaseDate = '';
  playIcon = faCirclePlay;

  duration = '';

  constructor(private readonly tvsService: TvsService) {}

  onPlay(event: MouseEvent) {
    this.play.emit(event);
  }

  ngOnInit(): void {
    const duration = dayjs.duration(this.episode?.runtime || 0);
    this.duration =
      (duration.asHours() >= 1 ? duration.hours() + 'h' : '') +
      duration.minutes() +
      'm';
    this.releaseDate = dayjs(this.episode?.releaseDate).format('D MMMM YYYY');
  }
}
