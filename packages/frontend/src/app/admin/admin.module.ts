import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RouterModule } from '@angular/router';
import { AdminMediasComponent } from './admin-medias/admin-medias.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminMediasComponent,
    AdminUsersComponent,
  ],
  imports: [CommonModule, RouterModule],
})
export class AdminModule {}
