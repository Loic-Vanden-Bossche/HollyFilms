import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { MediaWithTypeAndQueue } from '../../../shared/models/media.model';
import {
  ProgressStatus,
  StreamStatus,
} from '../../../shared/services/processing.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AdminService } from '../../../shared/services/admin.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-media-row',
  templateUrl: './media-row.component.html',
  animations: [
    trigger('onCircle', [
      transition(
        ':enter',
        [
          style({ opacity: 0 }),
          animate('1s {{delay}}ms ease', style({ opacity: 1 })),
        ],
        {
          params: {
            delay: 0,
          },
        },
      ),
    ]),
    trigger('onSelectionChange', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate(
          '0.5s ease',
          style({ opacity: 1, transform: 'translateX(0%)' }),
        ),
      ]),
    ]),
  ],
})
export class MediaRowComponent implements OnChanges {
  expanded = false;

  @Input() media: MediaWithTypeAndQueue | null = null;
  @Input() processData: ProgressStatus | null = null;

  @ViewChild('mediaContent') mediaContent: ElementRef<HTMLDivElement> | null =
    null;

  currentStatus = '';
  statusColor = '';
  selectedStream: StreamStatus | null = null;

  get fileName(): string {
    if (this.media && this.media.queue?.length) {
      return this.media.queue[0].filePath.split('/').pop() || '';
    }
    return '';
  }

  get contentHeight(): number {
    return this.mediaContent?.nativeElement.getBoundingClientRect().height || 0;
  }

  constructor(private readonly adminService: AdminService) {}

  trackUndefined() {
    return undefined;
  }

  removeFromQueue() {
    forkJoin(
      (this.media?.queue || []).map((file) =>
        this.adminService.removeFromQueue(file._id),
      ),
    ).subscribe(() => {
      this.adminService.refreshMedias();
    });
  }

  deleteMedia() {
    this.adminService.deleteMedia(this.media?.data._id || '').subscribe();
  }

  ngOnChanges() {
    if (this.processData) {
      if (!this.selectedStream) {
        this.selectedStream = this.processData.streamsStatus[0];
      }
      this.currentStatus = 'Traitement...';
      this.statusColor = '#F87272';
    } else if (this.fileName) {
      this.currentStatus = 'En attente';
      this.statusColor = '#FBBD23';
    } else {
      this.currentStatus = 'Importé';
      this.statusColor = '#36D399';
    }
  }
}
