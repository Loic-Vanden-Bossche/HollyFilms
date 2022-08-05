import { Component, OnInit } from '@angular/core';

import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { map, startWith, tap } from 'rxjs';
import {
  faFileCirclePlus,
  faSquarePlus,
} from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../shared/services/modal.service';
import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ProcessingService } from '../../shared/services/processing.service';
import { AdminService } from '../../shared/services/admin.service';
import { SystemMetrics } from '../../shared/models/system-metrics.model';

interface NavButton {
  label: string;
  path: Tabs;
}

type Tabs = 'users' | 'medias';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  animations: [
    trigger('onTabChange', [
      transition('* <=> *', [
        query(':enter', [
          style({
            opacity: 0,
          }),
        ]),
        query(':enter', [
          animate(
            '1000ms ease',
            style({
              opacity: 1,
            })
          ),
        ]),
      ]),
    ]),
  ],
})
export class AdminDashboardComponent implements OnInit {
  selectedTab: Tabs = 'medias';
  addingMovie = true;

  serverMetrics: SystemMetrics | null = null;
  queueStarted = false;

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
  addMediaIcon = faSquarePlus;

  constructor(
    private readonly router: Router,
    private readonly modalService: ModalService,
    private readonly processingService: ProcessingService,
    private readonly adminService: AdminService
  ) {}

  addMovie() {
    this.addingMovie = true;
    this.modalService.open('add-media-modal');
  }

  addTv() {
    this.addingMovie = false;
    this.modalService.open('add-media-modal');
  }

  prepareRoute(outlet: RouterOutlet): boolean {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  ngOnInit() {
    this.adminService
      .getInitialData()
      .pipe(
        tap(
          (data) =>
            (this.processingService.progressStatus =
              data.progressStatus || null)
        )
      )
      .subscribe((data) => {
        this.queueStarted = data.queueStarted;
      });

    this.router.events
      .pipe(
        map((e) => (e instanceof NavigationEnd ? e.url.split('/')[2] : '')),
        startWith(this.router.url.split('/')[2])
      )
      .subscribe((e) => {
        if (e) this.selectedTab = e as 'users' | 'medias';
      });

    this.processingService
      .onSystemInfosUpdated()
      .subscribe((status) => (this.serverMetrics = status));
  }
}
