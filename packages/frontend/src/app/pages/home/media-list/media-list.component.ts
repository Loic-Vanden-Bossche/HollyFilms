import { Component, Input } from '@angular/core';
import { MediaWithType } from '../../../shared/models/media.model';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
})
export class MediaListComponent {
  @Input() mediaList: MediaWithType[] = [];
}
