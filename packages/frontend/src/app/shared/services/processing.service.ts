import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { FileInfos } from '../models/file-infos.model';

export interface ProgressStatus {
  mainStatus: string;
  mainMsg: string;
  streamsStatus: StreamStatus[];
  fileInfos: FileInfos;
}

export interface StreamStatus {
  type: string;
  tag: string;
  data?: any;
  prog?: number;
  index?: number;
  stringToAppend?: string;
  lang?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProcessingService {
  constructor(private readonly socket: Socket) {
    this.socket = socket;
  }

  onStatusUpdated() {
    return this.socket.fromEvent<ProgressStatus>('processing-media');
  }

  onDownloadStatusUpdated() {
    return this.socket.fromEvent<any>('processing-videoDownload');
  }

  onSystemInfosUpdated() {
    return this.socket.fromEvent('si-data');
  }
}
