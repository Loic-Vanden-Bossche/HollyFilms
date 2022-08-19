import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NotActivatedComponent } from './not-activated/not-activated.component';
import { CategoryListComponent } from './navbar/category-list/category-list.component';

@NgModule({
  declarations: [NavbarComponent, PageNotFoundComponent, NotActivatedComponent, CategoryListComponent],
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
