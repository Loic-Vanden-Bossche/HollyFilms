import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MediaWithTypeAndFeatured } from '../../shared/models/media.model';

import EffectCarousel from './carrousel-effect';

import SwiperCore, {
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
  SwiperOptions,
  Virtual,
} from 'swiper';
import {
  animate,
  animateChild,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Swiper } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

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
    trigger('onLoader', [
      transition(':leave', [
        style({
          opacity: 1,
        }),
        animate(
          '0.5s ease',
          style({
            opacity: 0,
          }),
        ),
      ]),
    ]),
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
            }),
          ),
        ],
        { params: { delay: 0 } },
      ),
    ]),
    trigger('onCarouselGlobal', [
      state(
        'true',
        style({ transform: 'perspective(500px) scaleZ(2) rotateY(10deg)' }),
      ),
      state(
        'false',
        style({ transform: 'perspective(1) scaleZ(1) rotateY(0deg)' }),
      ),
      transition('false <=> true', animate('2s ease')),
      transition('false => true', query('@*', [animateChild()])),
    ]),
  ],
})
export class MediaCarrouselComponent implements OnChanges {
  @Input() featured: MediaWithTypeAndFeatured[] | null = [];
  @ViewChild('swiper') swiper: SwiperComponent | null = null;

  loading = true;

  index = 0;

  config: SwiperOptions = {
    modules: [Autoplay, Navigation, Pagination, EffectCarousel],
    effect: 'carousel' as any,
    grabCursor: true,
    loop: true,
    loopedSlides: 10,
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

  ngOnChanges() {
    if (this.featured?.length) {
      setTimeout(() => {
        this.loading = false;

        if (this.swiper) {
          this.swiper.swiperRef.update();
          this.index = this.swiper.swiperRef.activeIndex;
        }
      });
    }
  }

  slideChanged([swiper]: Swiper[]) {
    if (swiper.isBeginning) {
      this.index = 0;
    } else {
      this.index = swiper.realIndex;
    }
  }
}
