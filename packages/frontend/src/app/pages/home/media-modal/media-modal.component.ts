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

dayjs.extend(duration);

@Component({
  selector: 'app-media-modal',
  templateUrl: './media-modal.component.html',
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

  @ViewChild('player') player: YouTubePlayer | null = null;

  constructor(private readonly modalService: ModalService) {}

  ngOnInit() {
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  ngOnChanges() {
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
