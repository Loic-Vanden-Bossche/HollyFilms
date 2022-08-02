import { Component, Input } from '@angular/core';
import { Profile } from '../../../shared/models/profile.model';
import { Review } from '../../../shared/models/review.model';
import { Actor } from '../../../shared/models/actor.model';

@Component({
  selector: 'app-media-infos',
  templateUrl: './media-infos.component.html',
})
export class MediaInfosComponent {
  @Input() director: Profile | null = null;
  @Input() reviews: Review[] = [];
  @Input() overview = '';
  @Input() casting: Actor[] = [];
}
