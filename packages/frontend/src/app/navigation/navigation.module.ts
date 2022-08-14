import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NotActivatedComponent } from './not-activated/not-activated.component';

@NgModule({
  declarations: [NavbarComponent, PageNotFoundComponent, NotActivatedComponent],
  exports: [NavbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class NavigationModule {}
