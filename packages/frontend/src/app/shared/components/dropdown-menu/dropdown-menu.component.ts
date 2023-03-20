import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  animations: [
    trigger('onOpen', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-10px)',
        }),
        animate(
          '0.2s ease',
          style({
            opacity: 1,
            transform: 'translateY(0)',
          }),
        ),
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'translateY(0)',
        }),
        animate(
          '0.1s ease',
          style({
            opacity: 0,
            transform: 'translateY(-10px)',
          }),
        ),
      ]),
    ]),
  ],
})
export class DropdownMenuComponent implements AfterViewInit {
  translateValue = 0;
  translatePercent = 0;

  @Input() floatPosition: 'left' | 'center' | 'right' = 'center';
  @ViewChild('dropDownButton') button: ElementRef<HTMLDivElement> | null = null;

  menuOpen = false;

  ngAfterViewInit() {
    setTimeout(() => {
      const elemWidth =
        this.button?.nativeElement.getBoundingClientRect().width || 0;
      switch (this.floatPosition) {
        case 'left':
          this.translateValue = 0;
          this.translatePercent = 0;
          break;
        case 'center':
          this.translateValue = elemWidth / 2;
          this.translatePercent = -50;
          break;
        case 'right':
          this.translateValue = elemWidth;
          this.translatePercent = -100;
          break;
      }
    }, 100);
  }

  onMouseUp() {
    setTimeout(() => {
      this.menuOpen = false;
    }, 0);
  }
}
