import { Component } from '@angular/core';
import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  animations: [
    trigger('on404Letter', [
      transition(
        ':enter',
        [
          query(
            ':self',
            [
              style({
                opacity: 0,
                transform: 'TranslateX(-150%) TranslateY(-150%)',
              }),
              animate(
                '1s {{delay}}ms ease',
                style({
                  opacity: 1,
                  transform: 'TranslateX(0px) TranslateY(0px)',
                })
              ),
            ],
            { optional: true }
          ),
        ],
        { params: { delay: 0 } }
      ),
    ]),
    trigger('onTextDisplay', [
      transition(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'TranslateY(-100%)',
          }),
          animate(
            '1s {{delay}}ms ease',
            style({
              opacity: 1,
              transform: 'TranslateY(0) TranslateX(0)',
            })
          ),
        ],
        { params: { delay: 0 } }
      ),
    ]),
  ],
})
export class PageNotFoundComponent {}
