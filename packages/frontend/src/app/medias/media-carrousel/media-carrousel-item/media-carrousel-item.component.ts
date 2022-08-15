import { Component, Input, OnInit } from '@angular/core';
import {
  FeaturedType,
  MediaWithType,
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
import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { PlayerService } from '../../../shared/services/player.service';
import { MediasService } from '../../../shared/services/medias.service';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'app-media-carrousel-item',
  templateUrl: './media-carrousel-item.component.html',
  animations: [
    trigger('onCardOpenClose', [
      transition(':enter', [
        group([
          query(
            '@onProgressCircle',
            [
              style({
                transform: 'Rotate(10deg) Scale(0.5)',
              }),
              animate(
                '1s ease',
                style({
                  transform: 'Rotate(0deg) Scale(1)',
                })
              ),
            ],
            { optional: true }
          ),
          query(
            '@onStatusFeatured',
            [
              style({
                transform: 'TranslateY(-100%) TranslateX(-10px)',
              }),
              animate(
                '1s ease',
                style({
                  transform: 'TranslateY(0) TranslateX(0)',
                })
              ),
            ],
            { optional: true }
          ),
          query(':self', [
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
        ]),
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
    trigger('onProgressCircle', []),
    trigger('onStatusFeatured', []),
  ],
})
export class MediaCarrouselItemComponent implements OnInit {
  @Input() media: MediaWithTypeAndFeatured | null = null;
  @Input() selected = false;

  vendorTag = '';
  vendorIcon: IconDefinition | null = null;

  addToListIcon = faPlusCircle;
  likeButton = faThumbsUp;

  ratingProgress = 0;

  get circleRadius() {
    if (window.innerWidth <= 768) {
      return { radius: 35, textSize: 13, innerStrokeSize: 3, strokeSize: 7 };
    } else {
      return { radius: 50, textSize: 16, innerStrokeSize: 5, strokeSize: 10 };
    }
  }

  constructor(
    private readonly playerService: PlayerService,
    private readonly mediasService: MediasService,
    private readonly modalService: ModalService
  ) {}

  openModal(media: MediaWithType) {
    this.mediasService.selectMedia(media);
    this.modalService.open('mediaModal');
  }

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
