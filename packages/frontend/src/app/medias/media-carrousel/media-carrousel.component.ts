import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  MediaWithType,
  MediaWithTypeAndFeatured,
} from '../../shared/models/media.model';
import { MediasService } from '../../shared/services/medias.service';
import { shuffle } from '../../shared/utils';

import EffectCarousel from './carrousel-effect';

import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  SwiperOptions,
  Virtual,
} from 'swiper';
import { animate, style, transition, trigger } from '@angular/animations';
import { Swiper } from 'swiper';

SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  Autoplay,
  Virtual,
  EffectCarousel,
]);

@Component({
  selector: 'app-media-carrousel',
  templateUrl: './media-carrousel.component.html',
  animations: [
    trigger('onCarousel', [
      transition(
        ':enter',
        [
          style({
            transform: 'TranslateX(-20px) TranslateY(-150%)',
          }),
          animate(
            '1s {{delay}}ms ease',
            style({
              transform: 'TranslateX(0px) TranslateY(0px)',
            })
          ),
        ],
        { params: { delay: 0 } }
      ),
    ]),
    trigger('onCarouselGlobal', [
      transition(':enter', [
        style({
          transform: 'perspective(500px) scaleZ(2) rotateY(10deg)',
        }),
        animate(
          '3s ease',
          style({
            transform: 'perspective(1) scaleZ(1) rotateY(0deg)',
          })
        ),
      ]),
    ]),
  ],
})
export class MediaCarrouselComponent implements OnInit {
  @Output() mediaSelected = new EventEmitter<MediaWithType>();

  featured: MediaWithTypeAndFeatured[] = [];
  index = 0;

  config: SwiperOptions = {
    modules: [Autoplay, Navigation, Pagination, EffectCarousel],
    effect: 'carousel' as any,
    grabCursor: true,
    loop: true,
    loopedSlides: 9,
    slidesPerView: 'auto',
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
    },
    autoplay: {
      delay: 6000,
    },
  };

  constructor(private readonly mediasService: MediasService) {}

  slideChanged([swiper]: Swiper[]) {
    if (swiper.isBeginning) {
      this.index = 0;
    } else {
      this.index = swiper.realIndex;
    }
  }

  ngOnInit(): void {
    this.mediasService.getFeaturedMedias().subscribe((medias) => {
      this.featured = shuffle(medias);
    });
  }
}
