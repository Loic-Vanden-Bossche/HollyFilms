import { Component, Input, OnChanges } from '@angular/core';
import { ColorMap } from '../../utils';

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
})
export class ProgressCircleComponent implements OnChanges {
  @Input() progress = 0;
  @Input() circleRadius = 20;
  @Input() strokeSize = 5;
  @Input() innerStrokeSize = 2;
  @Input() colorMap: ColorMap[] = [
    { color: '#F87272', breakpoint: 20 },
    { color: '#FBBD23', breakpoint: 40 },
    { color: '#FFFF77', breakpoint: 70 },
    { color: '#36D399', breakpoint: 100 },
  ];
  @Input() textSize = 9;
  @Input() extend = false;

  @Input() subText = '';

  color = this.colorMap[0].color;

  dashoffset = 0;
  dasharray = 130;

  colorFromColorMap(colorMap: ColorMap[], percent: number): string {
    const colorMapLength = colorMap.length;
    for (let i = 0; i < colorMapLength; i++) {
      if (percent < colorMap[i].breakpoint) {
        return colorMap[i].color;
      }
    }
    return colorMap[colorMapLength - 1].color;
  }

  ngOnChanges() {
    this.dasharray = this.circleRadius * Math.PI * 2;
    this.dashoffset = this.dasharray;
    const goal = this.progress / 100;
    this.dashoffset = this.dasharray - this.dasharray * goal;
    this.color = this.colorFromColorMap(this.colorMap, this.progress);
  }
}
