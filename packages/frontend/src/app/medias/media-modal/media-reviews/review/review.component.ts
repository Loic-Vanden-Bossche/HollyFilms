import { Component, Input, OnInit } from '@angular/core';
import { Review } from '../../../../shared/models/review.model';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
})
export class ReviewComponent implements OnInit {
  @Input() review: Review | null = null;

  authorTag = '';

  ngOnInit(): void {
    this.authorTag = this.review?.author.name.replace(/\s/g, '') || '';
  }
}
