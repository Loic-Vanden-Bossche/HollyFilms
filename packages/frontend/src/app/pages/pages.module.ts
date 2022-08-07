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

@NgModule({
  declarations: [PagesComponent, HomeComponent, ShowcaseComponent],
  imports: [
    MediasModule,
    RouterModule,
    NavigationModule,
    CommonModule,
    InfiniteScrollModule,
    ScrollingModule,
  ],
})
export class PagesModule {}
