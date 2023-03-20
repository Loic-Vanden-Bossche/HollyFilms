import { Component, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-no-content',
  templateUrl: './no-content.component.html',
  animations: [
    trigger('onNoData', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'TranslateY(-10px)',
        }),
        animate(
          '1s ease',
          style({
            opacity: 1,
            transform: 'TranslateY(0)',
          }),
        ),
      ]),
    ]),
  ],
})
export class NoContentComponent {
  @Input() text = '';
}
