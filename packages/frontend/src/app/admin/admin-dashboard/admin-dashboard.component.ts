import { Component, OnDestroy, OnInit } from '@angular/core';

import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { map, startWith, tap } from 'rxjs';
import {
  faArrowsRotate,
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
import { NotificationsService } from '../../shared/services/notifications.service';
import { NotificationType } from '../../shared/models/notification.model';

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
export class AdminDashboardComponent implements OnInit, OnDestroy {
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

  updatingMedias = false;

  addFileIcon = faFileCirclePlus;
  addMediaIcon = faSquarePlus;
  updateMediasIcon = faArrowsRotate;

  constructor(
    private readonly router: Router,
    private readonly modalService: ModalService,
    private readonly processingService: ProcessingService,
    private readonly adminService: AdminService,
    private readonly notificationsService: NotificationsService
  ) {}

  addMovie() {
    this.addingMovie = true;
    this.modalService.open('add-media-modal');
  }

  addTv() {
    this.addingMovie = false;
    this.modalService.open('add-media-modal');
  }

  updateAllMedias() {
    this.updatingMedias = true;
    this.adminService.updateAllMedias().subscribe({
      next: () => {
        this.updatingMedias = false;
        this.notificationsService.push({
          type: NotificationType.Success,
          message: 'Tous les médias ont étés mis à jour',
          lifetime: 3000,
        });
      },
      error: () => {
        this.updatingMedias = false;
        this.notificationsService.push({
          type: NotificationType.Error,
          message: 'Une erreur est survenue lors de la mise à jour des médias',
          lifetime: 3000,
        });
      },
    });
  }

  prepareRoute(outlet: RouterOutlet): boolean {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  ngOnDestroy() {
    this.processingService.progressStatus = null;
    this.processingService.unregisterSocket();
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
