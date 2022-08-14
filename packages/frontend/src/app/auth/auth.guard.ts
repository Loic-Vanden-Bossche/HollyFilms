import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean | UrlTree {
    if (!this.auth.isAuthenticated) {
      return this.router.createUrlTree(['/sign-in']);
    }
    return true;
  }
}
