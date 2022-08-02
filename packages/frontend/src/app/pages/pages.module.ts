import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { ShowcaseComponent } from './showcase/showcase.component';
import { MediasModule } from '../medias/medias.module';
import { RouterModule } from '@angular/router';
import { NavigationModule } from '../navigation/navigation.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [PagesComponent, HomeComponent, ShowcaseComponent],
  imports: [MediasModule, RouterModule, NavigationModule, CommonModule],
})
export class PagesModule {}
