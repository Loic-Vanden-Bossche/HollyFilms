import { Component } from '@angular/core';
import { PlayerService } from '../shared/services/player.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  animations: [
    trigger('playMode', [
      transition(
        ':enter',
        [
          style({
            height: '0px',
            width: '0px',
            top: '{{y}}px',
            left: '{{x}}px',
          }),
          animate(
            '0.7s ease',
            style({
              height: '100vh',
              width: '100vw',
              top: '0px',
              left: '0px',
            })
          ),
        ],
        {
          params: {
            top: '0em',
            left: '0em',
          },
        }
      ),
    ]),
  ],
})
export class PagesComponent {
  constructor(private readonly playerService: PlayerService) {}

  get playData() {
    return this.playerService.playerData;
  }

  onPlayReady() {
    this.playerService.navigate();
  }
}
