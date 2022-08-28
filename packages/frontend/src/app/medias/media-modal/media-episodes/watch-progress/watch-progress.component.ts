import { Component, Input, OnInit } from '@angular/core';
import { fromSecondsToTime } from '../../../../shared/utils';

@Component({
  selector: 'app-watch-progress',
  templateUrl: './watch-progress.component.html',
})
export class WatchProgressComponent implements OnInit {
  @Input() totalTime = 0;
  @Input() currentTime = 0;

  displayTime = '';
  percent = 0;

  ngOnInit(): void {
    this.displayTime = fromSecondsToTime(this.currentTime);
    this.percent = Math.round((this.currentTime / this.totalTime) * 100);
  }
}
