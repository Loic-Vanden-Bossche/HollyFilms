import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { PwaService } from './shared/services/pwa.service';
import { ThemesService } from './shared/services/themes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(
    private readonly pwaService: PwaService,
    private readonly themeService: ThemesService,
    private readonly authService: AuthService
  ) {}

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: any) {
    this.pwaService.promptEvent = event;
  }

  get theme() {
    return this.themeService.currentTheme;
  }

  ngOnInit() {
    this.themeService.initializeTheme();
    this.authService.initAuth().subscribe();
  }
}
