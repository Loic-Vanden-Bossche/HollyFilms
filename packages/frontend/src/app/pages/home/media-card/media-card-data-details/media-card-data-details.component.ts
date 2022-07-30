import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediaWithType } from '../../../../shared/models/media.model';
import { faPlusCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

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

  ngOnInit(): void {
    this.overview = this.truncateOverview(this.media?.data.overview || '', 300);
  }

  truncateOverview(overview: string, n = 100): string {
    if (overview.length > n) {
      return overview.substring(0, n) + '...';
    } else {
      return overview;
    }
  }
}
