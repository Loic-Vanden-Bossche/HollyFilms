import { Component, Input, OnChanges } from '@angular/core';

export interface ColorMap {
  color: string;
  breakpoint: number;
}

@Component({
  selector: 'app-rating-circle',
  templateUrl: './rating-circle.component.html',
})
export class RatingCircleComponent implements OnChanges {
  @Input() rating = 0;
  @Input() maxRating = 10;
  @Input() extend = false;

  progress = 0;

  ngOnChanges() {
    this.progress = (this.rating / this.maxRating) * 100;
  }
}
