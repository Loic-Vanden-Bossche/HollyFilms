import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MediaWithType } from '../../../shared/models/media.model';
import { ModalService } from '../../../shared/services/modal.service';
import { YouTubePlayer } from '@angular/youtube-player';
import { faPlusCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { MediasService } from '../../../shared/services/medias.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {TvsService} from "../../../shared/services/tvs.service";

dayjs.extend(duration);

@Component({
  selector: 'app-media-modal',
  templateUrl: './media-modal.component.html',
  animations: [
    trigger('onTabChange', [
      transition(':enter', [
        style({ opacity: 0, 'transform': 'translateX(-10px)' }),
        animate(
          '0.5s ease',
          style({ opacity: 1, 'transform': 'translateX(0)' }),
        ),
      ]),
    ]),
  ],
})
export class MediaModalComponent implements OnChanges, OnInit {
  @Input() media: MediaWithType | null = null;
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  playerVars = {
    autoplay: 1,
    controls: 0,
    showinfo: 0,
    rel: 0,
    modestbranding: 1,
    iv_load_policy: 3,
    mute: 1,
  };

  displayedTime = '';

  seekTime = 20;

  apiLoaded = false;

  addToListIcon = faPlusCircle;
  likeButton = faThumbsUp;

  showEpisodes = false;

  isWatched: string | null = null;

  @ViewChild('player') player: YouTubePlayer | null = null;

  constructor(
    private readonly modalService: ModalService,
    private readonly mediasService: MediasService,
    private readonly tvsService: TvsService
  ) {}

  ngOnInit() {
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  ngOnChanges() {
    if (this.media?.mediaType === 'tv' && this.media) {
      this.showEpisodes = true;
      const indexes = this.tvsService.getTvClosestIndexes(this.media.data);

      if (indexes) {
        this.isWatched = `E${indexes.episodeIndex} S${indexes.seasonIndex}`;
      }
    }

    if (this.media?.mediaType === 'movie' && this.media) {
      this.showEpisodes = false;

      const watchedTime = this.mediasService.getMovieWatchedTime(
        this.media.data
      );

      if (watchedTime) {
        this.isWatched = `Continuer - ${dayjs
          .duration(watchedTime, 'minute')
          .format('H[h]mm')
          .replace(/00$/, '')}`;
      }
    }

    const time = 128;
    this.displayedTime = dayjs
      .duration(time, 'minute')
      .format('H[h]mm')
      .replace(/00$/, '');
  }

  onVideoReady() {
    this.seekToStart();
  }

  seekToStart() {
    this.player?.seekTo(this.seekTime, true);
  }

  onVideoStateChange(state: any) {
    if (state.data === 0) {
      this.player?.playVideo();
      this.seekToStart();
    }
  }

  close(): void {
    this.closed.emit();
    this.modalService.close('mediaModal');
  }

  get display(): boolean {
    return this.modalService.isDisplay('mediaModal') || false;
  }
}
