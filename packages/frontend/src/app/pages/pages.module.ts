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
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    NavigationModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
  ],
})
export class PagesModule {}
