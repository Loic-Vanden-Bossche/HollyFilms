import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { FileInfos } from '../models/file-infos.model';
import { BehaviorSubject, map } from 'rxjs';
import { AdminService } from './admin.service';
import { SystemMetrics } from '../models/system-metrics.model';

export interface ProgressStatus {
  mainStatus: string;
  mainMsg: string;
  streamsStatus: StreamStatus[];
  fileInfos: FileInfos;
}

export interface StreamData {
  avg_frame_rate: string;
  codec_long_name: string;
  channel_layout: string;
  codec_type: string;
  height: number | string;
  width: number | string;
  display_aspect_ratio: string;
  tags: { DURATION: string };
}

export interface StreamStatus {
  type: string;
  tag: string;
  data: StreamData;
  prog?: number;
  index?: number;
  stringToAppend?: string;
  lang?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProcessingService {
  private _progressStatus = new BehaviorSubject<ProgressStatus | null>(null);

  set progressStatus(status: ProgressStatus | null) {
    this._progressStatus.next(status);
  }

  get progressStatus(): ProgressStatus | null {
    return this._progressStatus.getValue();
  }

  get liveProgress() {
    return this._progressStatus.asObservable();
  }

  constructor(
    private readonly socket: Socket,
    private readonly adminService: AdminService
  ) {
    this.socket = socket;
  }

  onStatusUpdated() {
    return this.socket.fromEvent<ProgressStatus>('processing-media').pipe(
      map((status) => {
        if (status.mainStatus === 'ENDED') {
          this.adminService.refreshMedias();
          return null;
        }
        return status;
      })
    );
  }

  onDownloadStatusUpdated() {
    return this.socket.fromEvent<any>('processing-videoDownload');
  }

  onSystemInfosUpdated() {
    return this.socket.fromEvent<SystemMetrics>('si-data');
  }
}
