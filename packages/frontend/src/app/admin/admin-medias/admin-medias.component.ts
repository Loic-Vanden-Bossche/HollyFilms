import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';
import {
  ProcessingService,
  ProgressStatus,
} from '../../shared/services/processing.service';
import { SearchService } from '../../shared/services/search.service';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-admin-medias',
  templateUrl: './admin-medias.component.html',
})
export class AdminMediasComponent implements OnInit {
  progressStatus: ProgressStatus | null = null;

  get medias() {
    return this.adminService.medias;
  }

  constructor(
    private readonly adminService: AdminService,
    private readonly processingService: ProcessingService,
    private readonly searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchService
      .onChange()
      .pipe(switchMap((query) => this.adminService.getMedias(query)))
      .subscribe();

    this.adminService.refreshMediaList
      .pipe(
        switchMap(() => this.adminService.getMedias(this.searchService.search))
      )
      .subscribe();

    this.processingService
      .onStatusUpdated()
      .pipe(
        map((status) => {
          if (status.mainStatus === 'ENDED') {
            this.adminService.refreshMedias();
            return null;
          }
          return status;
        })
      )
      .subscribe((status) => (this.progressStatus = status));
    this.processingService
      .onDownloadStatusUpdated()
      .subscribe((status) => console.log(status));
    this.processingService
      .onSystemInfosUpdated()
      .subscribe((status) => console.log(status));
  }
}
