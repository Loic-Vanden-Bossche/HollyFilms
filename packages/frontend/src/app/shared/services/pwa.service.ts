import { Injectable } from '@angular/core';
import { NotificationType } from '../models/notification.model';
import { NotificationsService } from './notifications.service';
import {
  SwUpdate,
  VersionEvent,
  VersionReadyEvent,
} from '@angular/service-worker';
import { filter } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private _promptEvent: any = null;
  private _promptPwa = true;

  constructor(private notifications: NotificationsService, updates: SwUpdate) {
    updates.versionUpdates
      .pipe(
        filter(
          (evt: VersionEvent): evt is VersionReadyEvent =>
            evt.type === 'VERSION_READY'
        )
      )
      .subscribe(() =>
        updates.activateUpdate().then(() => document.location.reload())
      );
    if (localStorage.getItem('promptPwa') === 'false') this._promptPwa = false;

    this.notifications.push({
      close: () => this.closePrompt(),
      buttons: [
        { action: () => this.installPwa(), label: 'Installer' },
        { action: () => this.disableDisplay(), label: 'Ne plus afficher' },
      ],
      lifetime: null,
      type: NotificationType.Neutral,
      message: "Installer l'application",
    });
  }

  set promptEvent(event: any) {
    if (event && this._promptPwa) {
      this._promptEvent = event;
      event.preventDefault();

      this.notifications.push({
        close: () => this.closePrompt(),
        buttons: [
          { action: () => this.installPwa(), label: 'Installer' },
          { action: () => this.disableDisplay(), label: 'Ne plus afficher' },
        ],
        lifetime: null,
        type: NotificationType.Neutral,
        message: "Installer l'application",
      });
    } else {
      this._promptEvent = null;
    }
  }

  disableDisplay(): void {
    localStorage.setItem('promptPwa', 'false');
    this.closePrompt();
  }

  closePrompt(): void {
    if (this._promptEvent) {
      this.promptEvent = null;
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
