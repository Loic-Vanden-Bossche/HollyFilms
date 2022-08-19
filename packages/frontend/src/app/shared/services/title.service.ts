import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { toSentenceCase } from '../utils';
import {
  ActivatedRoute,
  ActivationEnd,
  NavigationEnd,
  Router,
} from '@angular/router';
import { filter, map, mergeMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly separator = ' - ';
  private readonly endTag = 'HollyFilms';

  private lastRouteTitle = '';

  constructor(
    private readonly title: Title,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof ActivationEnd || event instanceof NavigationEnd
        ),
        map(() => this.route),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data),
        tap((event) => (this.lastRouteTitle = event['title']))
      )
      .subscribe(() => this.setTitleFromRoute());
  }

  setTitleFromRoute() {
    this.setTitle(this.lastRouteTitle);
  }

  private buildTitle(title?: string): string {
    return title
      ? `${toSentenceCase(title)}${this.separator}${this.endTag}`
      : this.lastRouteTitle
      ? this.buildTitle(this.lastRouteTitle)
      : this.endTag;
  }

  setTitle(title?: string) {
    this.title.setTitle(this.buildTitle(title));
  }

  getTitle(): string {
    return this.title.getTitle();
  }
}
