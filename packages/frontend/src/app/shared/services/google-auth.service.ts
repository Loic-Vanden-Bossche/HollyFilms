import { Injectable } from '@angular/core';
import { CredentialResponse } from 'google-one-tap';
import { BehaviorSubject, mergeWith, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private _promptGoogleOneTap$ = new Subject<void>();
  private _googleAccountsInitialized = new BehaviorSubject<boolean>(false);

  get googleAccountsInitialized() {
    return this._googleAccountsInitialized.value;
  }

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly notificationsService: NotificationsService
  ) {}

  handleCredentialResponse(response: CredentialResponse) {
    this.auth.googleAuthenticate(response?.credential).subscribe((user) => {
      if (user.isActivated) {
        this.notificationsService.push({
          type: NotificationType.Success,
          message: 'Connexion avec google réussie !',
          lifetime: 3000,
        });
        this.router.navigate(['/home']);
      } else {
        this.notificationsService.push({
          type: NotificationType.Info,
          message:
            "Connexion avec google réussie ! Votre compte n'est pas encore activé.",
          lifetime: 3000,
        });
      }
    });
  }

  onGoogleAccountsInitialized() {
    return this._googleAccountsInitialized.asObservable();
  }

  fireOneTapPrompt() {
    this._promptGoogleOneTap$.next();
  }

  init() {
    this._promptGoogleOneTap$
      .pipe(mergeWith(this.auth.onUserDisconnected()))
      .subscribe(() => {
        if (
          !this.auth.isAuthenticated &&
          this._googleAccountsInitialized.value
        ) {
          window.google.accounts.id.prompt();
        }
      });

    window.onload = () => {
      window.google.accounts.id.initialize({
        prompt_parent_id: 'google_initialization_script',
        client_id:
          '186289745203-jfmotso6pcl928ptag74mi1a3fogevlr.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this),
        cancel_on_tap_outside: true,
      });

      this._googleAccountsInitialized.next(true);

      this.fireOneTapPrompt();
    };
  }
}
