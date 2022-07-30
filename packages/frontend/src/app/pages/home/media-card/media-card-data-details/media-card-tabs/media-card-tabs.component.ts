import { Component, Input, OnInit } from '@angular/core';
import { MediaCardTab } from '../media-card-data-details.component';
import { MediaWithType } from '../../../../../shared/models/media.model';

@Component({
  selector: 'app-media-card-tabs',
  templateUrl: './media-card-tabs.component.html',
})
export class MediaCardTabsComponent implements OnInit {
  @Input() media: MediaWithType | null = null;

  tabs: MediaCardTab[] = [
    { title: 'Description', value: 'overview' },
    { title: 'Casting', value: 'cast' },
  ];

  currentTab: MediaCardTab = this.tabs[0];

  overview = '';

  ngOnInit(): void {
    this.overview = this.truncateOverview(this.media?.data.overview || '', 300);
  }

  truncateOverview(overview: string, n = 100): string {
    if (overview.length > n) {
      return overview.substring(0, n) + '...';
    } else {
      return overview;
    }
  }
}
