import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaModalComponent } from './media-modal/media-modal.component';
import { MediaReviewsComponent } from './media-modal/media-reviews/media-reviews.component';
import { ReviewComponent } from './media-modal/media-reviews/review/review.component';
import { MediaInfosComponent } from './media-modal/media-infos/media-infos.component';
import { MediaEpisodesComponent } from './media-modal/media-episodes/media-episodes.component';
import { WatchProgressComponent } from './media-modal/media-episodes/watch-progress/watch-progress.component';
import { EpisodeComponent } from './media-modal/media-episodes/episode/episode.component';
import { MediaListComponent } from './media-list/media-list.component';
import { MediaCardComponent } from './media-card/media-card.component';
import { MediaCardDataDetailsComponent } from './media-card/media-card-data-details/media-card-data-details.component';
import { MediaCardTabsComponent } from './media-card/media-card-data-details/media-card-tabs/media-card-tabs.component';
import { MediaCardDataComponent } from './media-card/media-card-data/media-card-data.component';
import { ActorListComponent } from './actor-list/actor-list.component';
import { SharedModule } from '../shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MediaCarrouselComponent } from './media-carrousel/media-carrousel.component';
import { MediaCarrouselItemComponent } from './media-carrousel/media-carrousel-item/media-carrousel-item.component';
import { SwiperModule } from 'swiper/angular';
import { MediaRawListComponent } from './media-raw-list/media-raw-list.component';
import { MediaRawLineComponent } from './media-raw-list/media-raw-result-line/media-raw-line.component';

@NgModule({
  declarations: [
    MediaModalComponent,
    MediaReviewsComponent,
    ReviewComponent,
    MediaInfosComponent,
    MediaEpisodesComponent,
    WatchProgressComponent,
    EpisodeComponent,
    MediaListComponent,
    MediaCardComponent,
    MediaCardDataDetailsComponent,
    MediaCardTabsComponent,
    MediaCardDataComponent,
    ActorListComponent,
    MediaCarrouselComponent,
    MediaCarrouselItemComponent,
    MediaRawListComponent,
    MediaRawLineComponent,
  ],
  exports: [
    MediaModalComponent,
    MediaListComponent,
    MediaCarrouselComponent,
    MediaCardComponent,
    MediaRawListComponent,
  ],
  imports: [
    SwiperModule,
    CommonModule,
    SharedModule,
    MarkdownModule,
    YouTubePlayerModule,
    FontAwesomeModule,
    MarkdownModule.forRoot(),
    InfiniteScrollModule,
  ],
})
export class MediasModule {}
