import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MediaWithType } from '../../../shared/models/media.model';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
})
export class MediaListComponent {
  @Input() mediaList: MediaWithType[] = [];
  @Output() mediaSelected = new EventEmitter<MediaWithType>();
}
