import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map, startWith } from 'rxjs';

interface NavButton {
  label: string;
  path: Tabs;
}

type Tabs = 'users' | 'medias';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  selectedTab: Tabs = 'medias';

  navButtons: NavButton[] = [
    {
      label: 'Médias',
      path: 'medias',
    },
    {
      label: 'Utilisateurs',
      path: 'users',
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        map((e) => (e instanceof NavigationEnd ? e.url.split('/')[2] : '')),
        startWith(this.router.url.split('/')[2])
      )
      .subscribe((e) => {
        if (e) this.selectedTab = e as 'users' | 'medias';
      });
  }
}
