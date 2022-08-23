import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MediaWithType } from '../../shared/models/media.model';
import { ModalService } from '../../shared/services/modal.service';
import { YouTubePlayer } from '@angular/youtube-player';
import { faPlusCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

import * as dayjs from 'dayjs';
import { MediasService } from '../../shared/services/medias.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { TvsService } from '../../shared/services/tvs.service';
import { PlayerService } from '../../shared/services/player.service';
import { TitleService } from '../../shared/services/title.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-media-modal',
  templateUrl: './media-modal.component.html',
  animations: [
    trigger('onTabChange', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('0.5s ease', style({ opacity: 1, transform: 'translateX(0)' })),
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

  displayedTime: string | null = '';

  seekTime = 20;

  apiLoaded = false;

  addToListIcon = faPlusCircle;
  likeButton = faThumbsUp;

  showEpisodes = false;

  playLabel = 'Voir';

  get isLiked() {
    return (
      this.authService.user?.likedMedias
        .map((media) => media.mediaId)
        .includes(this.media?.data._id || '') || false
    );
  }

  get isInList() {
    return (
      this.authService.user?.mediasInList
        .map((media) => media.mediaId)
        .includes(this.media?.data._id || '') || false
    );
  }

  @ViewChild('player') player: YouTubePlayer | null = null;

  constructor(
    private readonly modalService: ModalService,
    private readonly mediasService: MediasService,
    private readonly tvsService: TvsService,
    private readonly playerService: PlayerService,
    private readonly title: TitleService,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  onLike() {
    if (this.media) {
      (this.isLiked
        ? this.mediasService.unlikeMedia(this.media)
        : this.mediasService.likeMedia(this.media)
      ).subscribe();
    }
  }

  onAddToList() {
    if (this.media) {
      (this.isInList
        ? this.mediasService.removeFromList(this.media)
        : this.mediasService.addInList(this.media)
      ).subscribe();
    }
  }

  ngOnChanges() {
    if (this.media) {
      this.title.setTitle(this.media.data.title);

      this.showEpisodes = this.media.mediaType === 'tv';

      this.playLabel = this.mediasService.getPlayLabelForMedia(this.media);

      this.displayedTime = this.media.data.fileInfos?.Sduration
        ? dayjs
            .duration(this.media?.data.fileInfos?.Sduration || 0, 'seconds')
            .format('H[h]mm')
            .replace(/00$/, '')
        : null;
    }
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

  onPlay($event: MouseEvent) {
    if (this.media) {
      this.playerService.play({
        mediaId: this.media.data._id,
        x: $event.clientX,
        y: $event.clientY,
      });
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
