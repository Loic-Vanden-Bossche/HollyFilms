import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { MediasModule } from '../medias/medias.module';
import { RouterModule } from '@angular/router';
import { NavigationModule } from '../navigation/navigation.module';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SearchResultsComponent } from './search-results/search-results.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';
import { ShowcaseMediasComponent } from './showcase/showcase-medias/showcase-medias.component';
import { ShowcaseMediaContentComponent } from './showcase/showcase-medias/showcase-media-content/showcase-media-content.component';
import { ShowcaseTextAnimationComponent } from './showcase/showcase-text-animation/showcase-text-animation.component';

@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    ShowcaseComponent,
    SearchResultsComponent,
    ShowcaseMediasComponent,
    ShowcaseMediaContentComponent,
    ShowcaseTextAnimationComponent,
  ],
  imports: [
    MediasModule,
    RouterModule,
    NavigationModule,
    CommonModule,
    InfiniteScrollModule,
    ScrollingModule,
    FontAwesomeModule,
    SharedModule,
  ],
})
export class PagesModule {}
