import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavbarComponent, PageNotFoundComponent],
  exports: [NavbarComponent],
  imports: [CommonModule, RouterModule],
})
export class NavigationModule {}
