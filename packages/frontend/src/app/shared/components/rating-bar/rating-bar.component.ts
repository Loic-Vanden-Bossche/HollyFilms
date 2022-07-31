import { Component, Input, OnInit } from '@angular/core';
import { ColorMap } from '../rating-circle/rating-circle.component';

@Component({
  selector: 'app-rating-bar',
  templateUrl: './rating-bar.component.html',
})
export class RatingBarComponent implements OnInit {
  @Input() rating = 0;
  @Input() max = 10;
  @Input() colorMap: ColorMap[] = [
    { color: '#F87272', breakpoint: 20 },
    { color: '#FBBD23', breakpoint: 40 },
    { color: '#FFFF77', breakpoint: 70 },
    { color: '#36D399', breakpoint: 100 },
  ];

  color = this.colorMap[0].color;
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

  ngOnInit(): void {
    this.percent = (this.rating / this.max) * 100;
    this.color = this.colorFromColorMap(this.colorMap, this.percent);
  }
}
