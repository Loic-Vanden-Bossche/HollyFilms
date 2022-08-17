import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  animations: [
    trigger('onMainTitle', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'TranslateY(-100%) TranslateX(-20px)',
        }),
        animate(
          '1.5s ease',
          style({
            opacity: 1,
            transform: 'TranslateY(0) TranslateX(0)',
          })
        ),
      ]),
    ]),
    trigger('onSubtitle', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'TranslateY(-100%)',
        }),
        animate(
          '1s 0.5s ease',
          style({
            opacity: 1,
            transform: 'TranslateY(0)',
          })
        ),
      ]),
    ]),
    trigger('onButtonInfos', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'TranslateY(30px) TranslateX(-80px) Scale(0.8)',
        }),
        animate(
          '1s 0.7s ease',
          style({
            opacity: 1,
            transform: 'TranslateY(0px) TranslateX(0px) Scale(1)',
          })
        ),
      ]),
    ]),
  ],
})
export class ShowcaseComponent {
  constructor(private readonly auth: AuthService) {}

  get isAuthenticated() {
    return this.auth.isAuthenticated;
  }

  get user() {
    return this.auth.user;
  }

  get isUserActivated() {
    return this.auth.isActivated;
  }
}
