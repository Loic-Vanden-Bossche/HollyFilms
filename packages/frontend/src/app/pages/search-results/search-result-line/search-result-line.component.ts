import { Component, Input } from '@angular/core';
import { MediaWithType } from '../../../shared/models/media.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-search-result-line',
  templateUrl: './search-result-line.component.html',
  animations: [
    trigger('onCard', [
      transition(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'TranslateX(-20px) TranslateY(-20px)',
          }),
          animate(
            '1s {{delay}}ms ease',
            style({
              opacity: 1,
              transform: 'TranslateX(0px) TranslateY(0px)',
            })
          ),
        ],
        { params: { delay: 0 } }
      ),
    ]),
  ],
})
export class SearchResultLineComponent {
  @Input() medias: MediaWithType[] = [];
}
