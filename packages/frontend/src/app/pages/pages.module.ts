import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NavigationModule } from '../navigation/navigation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowcaseComponent } from './showcase/showcase.component';

@NgModule({
  declarations: [PagesComponent, HomeComponent, ShowcaseComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    NavigationModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class PagesModule {}
