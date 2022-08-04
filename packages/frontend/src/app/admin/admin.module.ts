import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RouterModule } from '@angular/router';
import { AdminMediasComponent } from './admin-medias/admin-medias.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { MediaRowComponent } from './admin-medias/media-row/media-row.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddMediaModalComponent } from './add-media-modal/add-media-modal.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalFileComponent } from './add-media-modal/local-file/local-file.component';
import { TmdbResultComponent } from './add-media-modal/tmdb-result/tmdb-result.component';
import { UserRowComponent } from './admin-users/user-row/user-row.component';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminMediasComponent,
    AdminUsersComponent,
    MediaRowComponent,
    AddMediaModalComponent,
    LocalFileComponent,
    TmdbResultComponent,
    UserRowComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    SharedModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot({
      url: `${environment.websocketUrl}${environment.websocketNamespace}`,
      options: { path: environment.websocketNamespace, withCredentials: true },
    }),
  ],
})
export class AdminModule {}
