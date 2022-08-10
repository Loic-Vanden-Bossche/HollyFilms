import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { AdminService } from '../../../shared/services/admin.service';

@Component({
  selector: 'app-queue-controls',
  templateUrl: './queue-controls.component.html',
})
export class QueueControlsComponent implements OnInit {
  @Input() queueStarted = false;
  @Output() queueUpdated = new EventEmitter<boolean>();

  queueLength = 0;

  pauseQueueIcon = faPause;
  startQueueIcon = faPlay;
  clearQueueIcon = faStop;

  get canStartQueue() {
    return !this.queueStarted && this.queueLength > 0;
  }

  get canStopQueue() {
    return this.queueStarted && this.queueLength > 1;
  }

  get canClearQueue() {
    return this.canStopQueue || this.canStartQueue;
  }

  constructor(private readonly adminService: AdminService) {}

  ngOnInit() {
    this.adminService.medias.subscribe(
      (medias) => (this.queueLength = this.adminService.getQueueLength(medias))
    );
  }

  onStartQueue() {
    this.adminService.startQueue().subscribe(() => {
      this.queueStarted = true;
      this.queueUpdated.emit(true);
    });
  }

  onStopQueue() {
    this.adminService.stopQueue().subscribe(() => {
      this.queueStarted = false;
      this.queueUpdated.emit(false);
    });
  }

  onClearQueue() {
    this.adminService.clearQueue().subscribe(() => {
      this.queueStarted = false;
      this.queueUpdated.emit(false);
    });
  }
}
