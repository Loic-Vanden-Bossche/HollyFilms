import { Component } from '@angular/core';
import { NotificationsService } from '../../shared/services/notifications.service';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
})
export class NotificationsListComponent {
  constructor(private notificationsService: NotificationsService) {}

  get notifications() {
    return this.notificationsService.notifications;
  }

  onClose(id: string | undefined) {
    this.notificationsService.close(id || '');
  }
}
