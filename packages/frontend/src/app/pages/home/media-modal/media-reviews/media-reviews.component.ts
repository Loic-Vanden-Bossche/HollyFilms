import { Component, Input } from '@angular/core';
import { Review } from '../../../../shared/models/review.model';

@Component({
  selector: 'app-media-reviews',
  templateUrl: './media-reviews.component.html',
})
export class MediaReviewsComponent {
  @Input() reviews: Review[] = [];
}
