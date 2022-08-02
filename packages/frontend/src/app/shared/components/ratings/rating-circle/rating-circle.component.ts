import { Component, Input, OnChanges } from '@angular/core';
import { interval } from 'rxjs';

export interface ColorMap {
  color: string;
  breakpoint: number;
}

@Component({
  selector: 'app-rating-circle',
  templateUrl: './rating-circle.component.html',
})
export class RatingCircleComponent implements OnChanges {
  @Input() rating = 0;
  @Input() maxRating = 10;
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

  color = this.colorMap[0].color;

  dashoffset = 0;
  dasharray = 130;

  percent = 0;

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
    setTimeout(() => {
      const goal = (this.rating / this.maxRating) * 100;
      const inter = interval(2).subscribe(() => {
        this.dashoffset = this.dashoffset - 1;
        this.percent = (1 - this.dashoffset / this.dasharray) * 100;

        this.color = this.colorFromColorMap(this.colorMap, this.percent);

        if (this.percent >= goal) {
          this.percent = goal;
          inter.unsubscribe();
        }
      });
    }, 300);
  }
}
