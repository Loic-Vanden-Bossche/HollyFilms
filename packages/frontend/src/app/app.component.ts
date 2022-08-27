import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { PwaService } from './shared/services/pwa.service';
import { ThemesService } from './shared/services/themes.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { PlayerService } from './shared/services/player.service';
import { GoogleAuthService } from './shared/services/google-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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
export class AppComponent implements OnInit {
  title = 'frontend';

  get playData() {
    return this.playerService.playerData;
  }

  get theme() {
    return this.themeService.currentTheme;
  }

  constructor(
    private readonly pwaService: PwaService,
    private readonly themeService: ThemesService,
    private readonly authService: AuthService,
    private readonly playerService: PlayerService,
    private readonly googleAuth: GoogleAuthService
  ) {}

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: any) {
    this.pwaService.promptEvent = event;
  }

  onPlayReady() {
    this.playerService.navigate();
  }

  ngOnInit() {
    this.themeService.initializeTheme();
    this.authService.initAuth().subscribe();

    this.googleAuth.init();
  }
}
