import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RouterModule } from '@angular/router';
import { AdminMediasComponent } from './admin-medias/admin-medias.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { MediasTableComponent } from './admin-medias/medias-table/medias-table.component';
import { MediaRowComponent } from './admin-medias/medias-table/media-row/media-row.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddMediaModalComponent } from './add-media-modal/add-media-modal.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalFileComponent } from './add-media-modal/local-file/local-file.component';
import { TmdbResultComponent } from './add-media-modal/tmdb-result/tmdb-result.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminMediasComponent,
    AdminUsersComponent,
    MediasTableComponent,
    MediaRowComponent,
    AddMediaModalComponent,
    LocalFileComponent,
    TmdbResultComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
