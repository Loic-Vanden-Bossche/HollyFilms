import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
})
export class ShowcaseComponent {
  constructor(private readonly auth: AuthService) {}

  get isAuthenticated() {
    return this.auth.isAuthenticated;
  }

  get user() {
    return this.auth.user;
  }
}
