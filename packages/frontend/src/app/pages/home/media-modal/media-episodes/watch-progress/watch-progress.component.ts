import {Component, Input, OnInit} from '@angular/core';
import * as dayjs from "dayjs";

@Component({
  selector: 'app-watch-progress',
  templateUrl: './watch-progress.component.html'
})
export class WatchProgressComponent implements OnInit {

  @Input() totalTime: number = 0;
  @Input() currentTime: number = 0;

  displayTime = '';
  percent = 0;

  ngOnInit(): void {
    const duration = dayjs.duration(this.currentTime, 'seconds');
    this.displayTime = (duration.asHours() >= 1 ? duration.hours() + 'h' : '') + duration.minutes() + 'm';

    this.percent = Math.round(this.currentTime / this.totalTime * 100);
  }

}
