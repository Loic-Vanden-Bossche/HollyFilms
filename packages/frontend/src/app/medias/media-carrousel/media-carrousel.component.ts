import { Component, OnInit } from '@angular/core';
import { MediaWithTypeAndFeatured } from '../../shared/models/media.model';
import { MediasService } from '../../shared/services/medias.service';
import { BehaviorSubject } from 'rxjs';
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
})
export class MediaCarrouselComponent implements OnInit {
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
      delay: 3000,
    },
  };

  displayedMedias = new BehaviorSubject<MediaWithTypeAndFeatured[]>([]);

  constructor(private readonly mediasService: MediasService) {}

  ngOnInit(): void {
    this.mediasService.getFeaturedMedias().subscribe((medias) => {
      this.featured = shuffle(medias);
      console.log(this.featured.length);
    });
  }
}
