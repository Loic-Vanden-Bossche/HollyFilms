import { Component, Input, OnInit } from '@angular/core';
import { MediaWithTypeAndFeatured } from '../../../shared/models/media.model';

@Component({
  selector: 'app-media-carrousel-item',
  templateUrl: './media-carrousel-item.component.html',
})
export class MediaCarrouselItemComponent implements OnInit {
  @Input() media: MediaWithTypeAndFeatured | null = null;

  ngOnInit(): void {}
}
