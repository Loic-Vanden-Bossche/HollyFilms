import { Component, HostListener, OnInit } from '@angular/core';
import { MediasService } from '../../../shared/services/medias.service';
import { ShowcaseMedia } from '../../../shared/models/media.model';
import { animate, style, transition, trigger } from '@angular/animations';
import {
  debounceTime,
  filter,
  interval,
  map,
  mergeWith,
  Subject,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-showcase-medias',
  templateUrl: './showcase-medias.component.html',
  animations: [
    trigger('animCard', [
      transition(
        ':enter',
        [
          style({
            transform: 'translateX(100%) translateY(10px) scale(0.9)',
            opacity: 0,
          }),
          animate(
            '1s {{delay}}ms ease',
            style({
              transform: 'translateX(0) translateY(0) scale(1)',
              opacity: 1,
            })
          ),
        ],
        { params: { delay: 100 } }
      ),
    ]),
  ],
})
export class ShowcaseMediasComponent implements OnInit {
  private _medias: ShowcaseMedia[] = [];
  private _resize$ = new Subject<void>();

  private _mediasSelectable = false;

  mediaCols: {
    display: boolean;
    medias: ShowcaseMedia[];
  }[] = [];

  colCount = 5;
  rowCount = 15;

  get isBackgroundMode() {
    return window.innerWidth < 1280;
  }

  constructor(private readonly mediasService: MediasService) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this._resize$.next();
  }

  calculateColsCount() {
    if (this.isBackgroundMode) {
      return Math.floor(window.innerWidth / 100);
    }

    return Math.floor(window.innerWidth / 200);
  }

  isEven(index: number) {
    return index % 2 == 0;
  }

  resetSelectedMedias() {
    this.mediaCols.forEach((col) =>
      col.medias.forEach((media) => (media.selected = false))
    );
  }

  checkIfSelectable() {
    const selectable = window.innerWidth >= 1100;
    if (this._mediasSelectable && !selectable) {
      this.resetSelectedMedias();
      return false;
    } else if (!this._mediasSelectable && selectable) {
      return true;
    }

    return false;
  }

  // rearrange medias in random order
  randomizeColumn(medias: ShowcaseMedia[]) {
    return medias.sort(() => Math.random() - 0.5);
  }

  selectRandomMedia() {
    if (!this._mediasSelectable) return;

    const columnsToDisplay = 3;
    this.resetSelectedMedias();
    const randomCol = this.isBackgroundMode
      ? Math.floor(
          Math.random() *
            (this.mediaCols.length -
              1 -
              (this.mediaCols.length - (columnsToDisplay + 1)))
        ) +
        (this.mediaCols.length - (columnsToDisplay + 1))
      : Math.floor(Math.random() * (this.mediaCols.length - 1 - 2)) + 2;

    const isEven = this.isEven(randomCol);

    const mediaIndex = Math.floor(
      Math.random() * this.mediaCols[randomCol].medias.length
    );
    const elemRect = document
      .getElementById(`media-${randomCol}-${mediaIndex}`)
      ?.getBoundingClientRect();

    if (!elemRect) {
      return;
    }

    const topPos = elemRect.top + (isEven ? elemRect.height : -elemRect.height);

    if (
      (isEven &&
        topPos > window.innerHeight / 2 &&
        topPos < window.innerHeight) ||
      (!isEven && topPos < window.innerHeight / 2 && topPos > 0)
    ) {
      this.mediaCols[randomCol].medias[mediaIndex].selected = true;
    } else {
      this.selectRandomMedia();
    }
  }

  buildCols() {
    this.mediaCols = [];
    let prevRows = 0;
    for (let i = 0; i < this.colCount; i++) {
      const rows =
        Math.floor(Math.random() * (this.rowCount + 3 - (this.rowCount - 3))) +
        (this.rowCount - 3);
      this.mediaCols.push({
        display: false,
        medias: this._medias
          .slice(prevRows, prevRows + rows)
          .map((media) => ({ ...media, selected: false })),
      });
      prevRows += rows;
      setTimeout(() => {
        if (this.mediaCols[i]) {
          this.mediaCols[i].medias = this.randomizeColumn(
            this.mediaCols[i].medias
          );
          this.mediaCols[i].display = true;

          if (i === this.colCount - 1) {
            setTimeout(() => {
              this.selectRandomMedia();
            }, 2000);
          }
        }
      }, i * 300);
    }
  }

  ngOnInit() {
    this._mediasSelectable = this.checkIfSelectable();
    interval(10000).subscribe(() => this.selectRandomMedia());

    this.mediasService
      .getShowCaseMedias()
      .pipe(
        tap((medias) => (this._medias = medias)),
        mergeWith(
          this._resize$.pipe(
            debounceTime(50),
            map(() => this.calculateColsCount()),
            tap(() => (this._mediasSelectable = this.checkIfSelectable())),
            filter((count) => count !== this.colCount)
          )
        ),
        tap(() => (this.colCount = this.calculateColsCount()))
      )
      .subscribe(() => this.buildCols());
  }
}
