import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { NotificationComponent } from './notification/notification.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [NotificationsListComponent, NotificationComponent],
  exports: [NotificationsListComponent],
  imports: [CommonModule, BrowserAnimationsModule],
})
export class NotificationsModule {}
