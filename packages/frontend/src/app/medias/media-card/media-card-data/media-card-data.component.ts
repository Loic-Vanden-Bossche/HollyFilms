import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MediaWithType } from '../../../shared/models/media.model';
import { faPlusCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { MediasService } from '../../../shared/services/medias.service';
import { ModalService } from '../../../shared/services/modal.service';
import { Position } from '../media-card.component';

@Component({
  selector: 'app-media-card-data',
  templateUrl: './media-card-data.component.html',
})
export class MediaCardDataComponent {
  @Input() media: MediaWithType | null = null;
  @Output() showMore = new EventEmitter<Position>();

  addToListIcon = faPlusCircle;
  likeButton = faThumbsUp;

  constructor(
    private readonly mediasService: MediasService,
    private readonly modalService: ModalService
  ) {}

  posFromX(x: number): Position {
    if (x < document.body.getBoundingClientRect().width / 3) {
      return 'left';
    } else if (x > (document.body.getBoundingClientRect().width / 3) * 2) {
      return 'right';
    }

    return 'center';
  }

  onMouseOnDetails(event: MouseEvent): void {
    if (window.screen.width > 768) {
      this.showMore.emit(this.posFromX(event.pageX));
    }
  }

  onDetailsClick(): void {
    if (this.media) {
      this.mediasService.selectMedia(this.media);
      this.modalService.open('mediaModal');
    }
  }
}
