import { Component, OnInit } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { map, startWith } from 'rxjs';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../shared/services/modal.service';

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

  addFileIcon = faFileCirclePlus;

  constructor(
    private readonly router: Router,
    private readonly modalService: ModalService
  ) {}

  openModal() {
    this.modalService.open('add-media-modal');
  }

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
