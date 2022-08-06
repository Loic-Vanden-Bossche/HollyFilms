import { Component, Input, OnInit } from '@angular/core';
import { MediaCardTab } from '../media-card-data-details.component';
import { MediaWithType } from '../../../../shared/models/media.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-media-card-tabs',
  templateUrl: './media-card-tabs.component.html',
  animations: [
    trigger('onTabChange', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('0.5s ease', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class MediaCardTabsComponent implements OnInit {
  @Input() media: MediaWithType | null = null;

  tabs: MediaCardTab[] = [
    { title: "Vue d'ensemble", value: 'overview' },
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
