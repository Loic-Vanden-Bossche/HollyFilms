import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediaWithType } from '../../../shared/models/media.model';
import { faPlusCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { PlayerService } from '../../../shared/services/player.service';
import { MediasService } from '../../../shared/services/medias.service';
import { ModalService } from '../../../shared/services/modal.service';
import { AuthService } from '../../../shared/services/auth.service';

export interface MediaCardTab {
  title: string;
  value: string;
}

@Component({
  selector: 'app-media-card-data-details',
  templateUrl: './media-card-data-details.component.html',
})
export class MediaCardDataDetailsComponent implements OnInit {
  @Input() media: MediaWithType | null = null;
  @Output() mediaSelected = new EventEmitter<void>();

  addToListIcon = faPlusCircle;
  likeButton = faThumbsUp;

  playLabel = 'Voir';

  overview = '';

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

  constructor(
    private readonly playerService: PlayerService,
    private readonly mediasService: MediasService,
    private readonly modalService: ModalService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.media) {
      this.overview = this.truncateOverview(
        this.media.data.overview || '',
        300
      );
      this.playLabel = this.mediasService.getPlayLabelForMedia(this.media);
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

  onPlay(event: MouseEvent) {
    if (this.media) {
      this.playerService.play({
        mediaId: this.media.data._id,
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  openModal(media: MediaWithType) {
    this.mediasService.selectMedia(media);
    this.modalService.open('mediaModal');
  }

  truncateOverview(overview: string, n = 100): string {
    if (overview.length > n) {
      return overview.substring(0, n) + '...';
    } else {
      return overview;
    }
  }
}
