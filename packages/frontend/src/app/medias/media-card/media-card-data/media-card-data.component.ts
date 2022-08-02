import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MediaWithType } from '../../../shared/models/media.model';
import { faPlusCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-media-card-data',
  templateUrl: './media-card-data.component.html',
})
export class MediaCardDataComponent {
  @Input() media: MediaWithType | null = null;
  @Output() showMore = new EventEmitter<void>();

  addToListIcon = faPlusCircle;
  likeButton = faThumbsUp;
}
