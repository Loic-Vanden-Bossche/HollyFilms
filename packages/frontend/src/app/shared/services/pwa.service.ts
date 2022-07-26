import { Injectable } from '@angular/core';
import { NotificationType } from '../models/notification.model';
import { NotificationsService } from './notifications.service';
@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private _promptEvent: any = null;
  private _promptPwa = true;

  constructor(private notifications: NotificationsService) {
    if (localStorage.getItem('promptPwa') === 'false') this._promptPwa = false;
  }

  set promptEvent(event: any) {
    if (event && this._promptPwa) {
      this._promptEvent = event;
      event.preventDefault();

      this.notifications.push({
        close: () => this.closePrompt(),
        button: {
          action: () => this.installPwa(),
          label: 'Install',
        },
        type: NotificationType.Neutral,
        message: "Installer l'application",
      });
    } else {
      this._promptEvent = null;
    }
  }

  closePrompt(): void {
    if (this._promptEvent) {
      this.promptEvent = null;
      localStorage.setItem('promptPwa', 'false');
      this._promptPwa = false;
    }
  }

  installPwa(): void {
    if (this._promptEvent) {
      this._promptEvent.prompt();
    } else {
      console.error('Cannot install PWA');
    }
  }
}
