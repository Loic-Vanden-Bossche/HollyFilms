import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, pairwise } from 'rxjs';
import { Router, RoutesRecognized } from '@angular/router';

import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PreviousRouteService {
  private previousRoutePath = new BehaviorSubject<string>('');

  get previousRoute(): string {
    return this.previousRoutePath.value;
  }

  constructor(private router: Router, private location: Location) {
    this.previousRoutePath.next(this.location.path());

    this.router.events
      .pipe(
        filter((e) => e instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((event: any[]) => {
        this.previousRoutePath.next(event[0].urlAfterRedirects);
      });
  }
}
