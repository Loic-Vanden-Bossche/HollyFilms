import { Component, Input } from '@angular/core';
import { MediaWithType } from '../../../../shared/models/media.model';

@Component({
  selector: 'app-media-row',
  templateUrl: './media-row.component.html',
})
export class MediaRowComponent {
  @Input() media: MediaWithType | null = null;
}
