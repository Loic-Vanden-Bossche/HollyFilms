import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediaWithType } from '../../../shared/models/media.model';
import { faPlusCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { PlayerService } from '../../../shared/services/player.service';
import { MediasService } from '../../../shared/services/medias.service';
import { ModalService } from '../../../shared/services/modal.service';

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

  overview = '';

  constructor(
    private readonly playerService: PlayerService,
    private readonly mediasService: MediasService,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.overview = this.truncateOverview(this.media?.data.overview || '', 300);
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
