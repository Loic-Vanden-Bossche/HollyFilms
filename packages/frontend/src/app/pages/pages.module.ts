import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NavigationModule } from '../navigation/navigation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowcaseComponent } from './showcase/showcase.component';
import { MediaListComponent } from './home/media-list/media-list.component';
import { MediaCardComponent } from './home/media-card/media-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActorListComponent } from './home/actor-list/actor-list.component';
import { MediaCardDataComponent } from './home/media-card/media-card-data/media-card-data.component';
import { MediaCardDataDetailsComponent } from './home/media-card/media-card-data-details/media-card-data-details.component';
import { MediaCardTabsComponent } from './home/media-card/media-card-data-details/media-card-tabs/media-card-tabs.component';
import { MediaModalComponent } from './home/media-modal/media-modal.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { MediaReviewsComponent } from './home/media-modal/media-reviews/media-reviews.component';
import { ReviewComponent } from './home/media-modal/media-reviews/review/review.component';
import { MarkdownModule } from 'ngx-markdown';
import { MediaInfosComponent } from './home/media-modal/media-infos/media-infos.component';
import { MediaEpisodesComponent } from './home/media-modal/media-episodes/media-episodes.component';
import { EpisodeComponent } from './home/media-modal/media-episodes/episode/episode.component';
import { WatchProgressComponent } from './home/media-modal/media-episodes/watch-progress/watch-progress.component';

@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    ShowcaseComponent,
    MediaListComponent,
    MediaCardComponent,
    ActorListComponent,
    MediaCardDataComponent,
    MediaCardDataDetailsComponent,
    MediaCardTabsComponent,
    MediaModalComponent,
    MediaReviewsComponent,
    ReviewComponent,
    MediaInfosComponent,
    MediaEpisodesComponent,
    EpisodeComponent,
    WatchProgressComponent,
  ],
  imports: [
    YouTubePlayerModule,
    CommonModule,
    AppRoutingModule,
    SharedModule,
    NavigationModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    MarkdownModule.forRoot(),
  ],
})
export class PagesModule {}
