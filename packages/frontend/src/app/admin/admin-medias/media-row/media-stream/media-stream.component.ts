import { Component, Input, OnInit } from '@angular/core';
import { StreamStatus } from '../../../../shared/services/processing.service';

@Component({
  selector: 'app-media-stream',
  templateUrl: './media-stream.component.html',
})
export class MediaStreamComponent implements OnInit {
  @Input() stream: StreamStatus | null = null;

  labels: string[] = [];

  ngOnInit() {
    if (this.stream) {
      this.labels.push(this.stream.data.codec_long_name);

      const framerate =
        parseInt(this.stream.data.avg_frame_rate.split('/')[0]) /
        parseInt(this.stream.data.avg_frame_rate.split('/')[1]);
      if (framerate) {
        this.labels.push(`${framerate.toFixed(2)} fps`);
      }

      if (
        this.stream.data.height !== 'N/A' &&
        this.stream.data.width !== 'N/A' &&
        this.stream.data.width &&
        this.stream.data.height
      ) {
        this.labels.push(
          `${this.stream.data.height}x${this.stream.data.width}`,
        );
      }

      if (this.stream.data.display_aspect_ratio) {
        this.labels.push(this.stream.data.display_aspect_ratio);
      }

      if (this.stream.data.tags.DURATION) {
        this.labels.push(this.stream.data.tags.DURATION.split('.')[0]);
      }

      if (this.stream.data.channel_layout) {
        this.labels.push(this.stream.data.channel_layout);
      }
    }
  }
}
