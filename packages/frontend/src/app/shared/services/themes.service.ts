import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemesService {
  private _defaultTheme = 'light';
  private _currentTheme: string = this._defaultTheme;

  get currentTheme(): string {
    return this._currentTheme;
  }

  set currentTheme(theme: string) {
    this._currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  initializeTheme(): void {
    this.currentTheme = localStorage.getItem('theme') || this._defaultTheme;
  }
}
