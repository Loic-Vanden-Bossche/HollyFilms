import { Component, Input } from '@angular/core';
import { MediaWithTypeAndQueue } from '../../../shared/models/media.model';
import { ProgressStatus } from '../../../shared/services/processing.service';

@Component({
  selector: 'app-media-row',
  templateUrl: './media-row.component.html',
})
export class MediaRowComponent {
  expanded = false;

  @Input() media: MediaWithTypeAndQueue | null = null;
  @Input() processData: ProgressStatus | null = null;
}
