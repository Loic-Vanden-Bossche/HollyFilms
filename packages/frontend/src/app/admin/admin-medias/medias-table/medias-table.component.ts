import { Component, Input } from '@angular/core';
import { MediaWithType } from '../../../shared/models/media.model';

@Component({
  selector: 'app-medias-table',
  templateUrl: './medias-table.component.html',
})
export class MediasTableComponent {
  @Input() medias: MediaWithType[] = [];
}
