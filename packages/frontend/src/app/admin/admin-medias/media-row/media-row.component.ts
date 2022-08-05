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
        }
      ),
    ]),
    trigger('onSelectionChange', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate(
          '0.5s ease',
          style({ opacity: 1, transform: 'translateX(0%)' })
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

  currentStatus = 'Importé';
  statusColor = '#36D399';
  selectedStream: StreamStatus | null = null;

  get fileName(): string {
    if (this.media) {
      return this.media.queue?.fileName.split('/').pop() || '';
    }
    return '';
  }

  get contentHeight(): number {
    return this.mediaContent?.nativeElement.getBoundingClientRect().height || 0;
  }

  trackUndefined() {
    return undefined;
  }

  ngOnChanges() {
    console.log(this.processData?.streamsStatus);
    if (this.processData) {
      if (!this.selectedStream) {
        this.selectedStream = this.processData.streamsStatus[0];
      }
      this.currentStatus = 'Traitement...';
      this.statusColor = '#F87272';
    } else if (this.media?.queue?.fileName) {
      this.currentStatus = 'En attente';
      this.statusColor = '#FBBD23';
    }
  }
}
