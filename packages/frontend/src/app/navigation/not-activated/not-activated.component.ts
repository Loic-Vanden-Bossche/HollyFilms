import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-not-activated',
  templateUrl: './not-activated.component.html',
  animations: [
    trigger('onNotActivated', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'TranslateY(-100%) Scale(0.5)',
        }),
        animate(
          '1s ease',
          style({
            opacity: 1,
            transform: 'TranslateY(0) Scale(1)',
          }),
        ),
      ]),
    ]),
    trigger('onReturnToMenuButton', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'Scale(0.5)',
        }),
        animate(
          '1s 0.5s ease',
          style({
            opacity: 1,
            transform: 'Scale(1)',
          }),
        ),
      ]),
    ]),
  ],
})
export class NotActivatedComponent {}
