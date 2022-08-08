import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FeaturedType,
  MediaWithTypeAndFeatured,
} from '../../../shared/models/media.model';
import {
  faArrowTrendUp,
  faBolt,
  faCirclePlay,
  faList,
  faPlusCircle,
  faThumbsUp,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';
import { PlayerService } from '../../../shared/services/player.service';

@Component({
  selector: 'app-media-carrousel-item',
  templateUrl: './media-carrousel-item.component.html',
  animations: [
    trigger('onCardOpenClose', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'TranslateX(-20px) Scale(0.9)',
        }),
        animate(
          '1s ease',
          style({
            opacity: 1,
            transform: 'TranslateX(0px) Scale(1)',
          })
        ),
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'TranslateX(0px) Scale(1)',
        }),
        animate(
          '1s ease',
          style({
            opacity: 0,
            transform: 'TranslateX(-20px) Scale(0.9)',
          })
        ),
      ]),
    ]),
  ],
})
export class MediaCarrouselItemComponent implements OnInit {
  @Input() media: MediaWithTypeAndFeatured | null = null;
  @Input() selected = false;

  @Output() mediaSelected = new EventEmitter<void>();

  vendorTag = '';
  vendorIcon: IconDefinition | null = null;

  addToListIcon = faPlusCircle;
  likeButton = faThumbsUp;

  ratingProgress = 0;

  constructor(private readonly playerService: PlayerService) {}

  getTagAndIconFromFeatured(featured: FeaturedType): [string, IconDefinition] {
    switch (featured) {
      case FeaturedType.CONTINUE:
        return [
          'Vous avez commencé ce film, continuer la lecture ?',
          faCirclePlay,
        ];
      case FeaturedType.INLIST:
        return ['Ceci est dans votre liste', faList];
      case FeaturedType.POPULAR:
        return ['Très populaire sur HollyFilms', faArrowTrendUp];
      case FeaturedType.RECENT:
        return ['Nouveau sur HollyFilms', faBolt];
      case FeaturedType.RECOMMENDED:
        return [' Recommandé pour vous', faUserCheck];
    }
  }

  onPlay(event: MouseEvent) {
    if (this.media) {
      this.playerService.play({
        mediaId: this.media.data._id,
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  ngOnInit(): void {
    if (this.media) {
      [this.vendorTag, this.vendorIcon] = this.getTagAndIconFromFeatured(
        this.media.featured
      );
      this.ratingProgress = (this.media.data.rating * 100) / 10;
    }
  }
}
