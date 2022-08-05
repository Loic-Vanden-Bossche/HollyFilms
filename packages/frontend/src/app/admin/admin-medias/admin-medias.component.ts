import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';
import { ProcessingService } from '../../shared/services/processing.service';
import { SearchService } from '../../shared/services/search.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-admin-medias',
  templateUrl: './admin-medias.component.html',
})
export class AdminMediasComponent implements OnInit {
  get medias() {
    return this.adminService.medias;
  }

  get progressStatus() {
    return this.processingService.liveProgress;
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
      .subscribe((status) => (this.processingService.progressStatus = status));

    this.processingService
      .onDownloadStatusUpdated()
      .subscribe((status) => console.log(status));
  }
}
