import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AlreadyActivatedGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean | UrlTree {
    if (this.auth.isActivated) {
      return this.router.createUrlTree(['/not-found']);
    }

    return true;
  }
}
