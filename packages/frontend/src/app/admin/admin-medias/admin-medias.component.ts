import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';
import { ProcessingService } from '../../shared/services/processing.service';
import { SearchService } from '../../shared/services/search.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-admin-medias',
  templateUrl: './admin-medias.component.html',
})
export class AdminMediasComponent implements OnInit {
  get medias() {
    return this.adminService.filteredMedias;
  }

  get firstMedia() {
    return this.adminService.firstFilteredMedia;
  }

  get progressStatus() {
    return this.processingService.liveProgress;
  }

  constructor(
    private readonly adminService: AdminService,
    private readonly processingService: ProcessingService,
    private readonly searchService: SearchService,
  ) {}

  ngOnInit(): void {
    this.searchService
      .onChange()
      .pipe(tap((query) => this.adminService.filterMedias(query)))
      .subscribe();

    this.adminService.refreshMediaList
      .pipe(switchMap(() => this.adminService.getMedias()))
      .subscribe();

    if (this.adminService.medias.length === 0) {
      this.adminService.refreshMedias();
    }

    this.processingService
      .onStatusUpdated()
      .subscribe((status) => (this.processingService.progressStatus = status));
  }
}
