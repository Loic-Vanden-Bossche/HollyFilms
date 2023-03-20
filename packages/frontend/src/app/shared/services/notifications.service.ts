import { Injectable } from '@angular/core';
import { Notification, NotificationType } from '../models/notification.model';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private _notifications: Notification[] = [];

  push(notification: Partial<Notification>) {
    this._notifications.push({
      message: '',
      buttons: [],
      lifetime: 3000,
      type: NotificationType.Neutral,
      ...notification,
      id: uuid(),
    });
  }

  close(id: string) {
    setTimeout(() => {
      this._notifications = this._notifications.filter(
        (notification) => notification.id !== id,
      );
    }, 200);
  }

  get notifications(): Notification[] {
    return this._notifications;
  }
}
