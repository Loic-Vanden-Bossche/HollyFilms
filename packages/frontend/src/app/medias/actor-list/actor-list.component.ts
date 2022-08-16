import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Actor } from '../../shared/models/actor.model';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-actor-list',
  templateUrl: './actor-list.component.html',
  animations: [
    trigger('onControl', [
      transition(':enter', [
        style({
          transform: 'TranslateX({{transform}}%)',
        }),
        animate(
          '0.5s ease',
          style({
            transform: 'TranslateX(0%)',
          })
        ),
      ]),
    ]),
  ],
})
export class ActorListComponent {
  @Input() actors: Actor[] = [];
  @ViewChild('container') container: ElementRef | null = null;

  scroll = 800;

  chevronRightIcon = faChevronRight;
  chevronLeftIcon = faChevronLeft;

  get canScrollLeft() {
    return this.container && this.container.nativeElement.scrollLeft > 0;
  }

  get canScrollRight() {
    return (
      this.container &&
      this.container.nativeElement.scrollLeft +
        this.container.nativeElement.getBoundingClientRect().width <
        this.container.nativeElement.scrollWidth
    );
  }

  onScrollLeft() {
    if (this.container) {
      this.container.nativeElement.scrollLeft -= this.scroll;
    }
  }

  onScrollRight() {
    if (this.container) {
      this.container.nativeElement.scrollLeft += this.scroll;
    }
  }
}
