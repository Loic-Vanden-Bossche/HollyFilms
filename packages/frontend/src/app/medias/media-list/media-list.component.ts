import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ListType, MediaWithType } from '../../shared/models/media.model';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  mergeMap,
  of,
  tap,
} from 'rxjs';
import { MediasService } from '../../shared/services/medias.service';
import { animate, style, transition, trigger } from '@angular/animations';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
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
          }),
        ),
      ]),
    ]),
    trigger('onCard', [
      transition(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'TranslateX(-20px) TranslateY(-20px)',
          }),
          animate(
            '1s {{delay}}ms ease',
            style({
              opacity: 1,
              transform: 'TranslateX(0px) TranslateY(0px)',
            }),
          ),
        ],
        { params: { delay: 0 } },
      ),
    ]),
  ],
})
export class MediaListComponent implements OnChanges, OnInit {
  @Input() type: ListType = ListType.ALL;
  @Input() cachedMedias: MediaWithType[] = [];
  @Output() mediasRetrieved = new EventEmitter<MediaWithType[]>();
  @Output() noData = new EventEmitter<void>();

  @ViewChild('scroller') scroller: ElementRef<HTMLDivElement> | null = null;

  viewInit = false;

  medias = new BehaviorSubject<MediaWithType[]>([]);

  skip = new BehaviorSubject<{ value: number; propagate: boolean }>({
    value: 0,
    propagate: false,
  });

  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  scroll = 800;

  chevronRightIcon = faChevronRight;
  chevronLeftIcon = faChevronLeft;

  animationDelay(index: number) {
    const value = index - this.skip.value.value;
    if (value > 0) {
      return value * 100;
    }
    return index * 100;
  }

  get canScrollLeft() {
    return (
      this.viewInit &&
      this.scroller &&
      this.scroller.nativeElement.scrollLeft > 0
    );
  }

  get canScrollRight() {
    return (
      this.viewInit &&
      this.scroller &&
      this.scroller.nativeElement.scrollLeft +
        this.scroller.nativeElement.getBoundingClientRect().width <
        this.scroller.nativeElement.scrollWidth
    );
  }

  constructor(private readonly mediasService: MediasService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['type']) {
      this.viewInit = false;
      setTimeout(() => {
        this.viewInit = true;
      }, 500);
      if (this.cachedMedias.length > 0) {
        this.skip.next({ value: 10, propagate: false });
        this.medias.next(this.cachedMedias);
      } else {
        this.skip.next({ value: 0, propagate: true });
        this.medias.next([]);
      }
    }
  }

  ngOnInit() {
    this.skip
      .pipe(
        filter((x) => x.propagate),
        mergeMap((skip) =>
          this.mediasService.getMedias(this.type, skip.value).pipe(
            catchError(() => of([])),
            tap((medias) =>
              !medias.length && !this.skip.value.value
                ? this.noData.emit()
                : void 0,
            ),
          ),
        ),
        map((medias) => [...this.medias.value, ...medias]),
      )
      .subscribe((medias) => this.medias.next(medias));

    this.medias.subscribe((medias) =>
      this.mediasRetrieved.emit(medias.slice(0, this.mediasService.limit)),
    );
  }

  onScrollLeft() {
    if (this.scroller) {
      this.scroller.nativeElement.scrollLeft -= this.scroll;
    }
  }

  onScrollRight() {
    if (this.scroller) {
      this.scroller.nativeElement.scrollLeft += this.scroll;
    }
  }

  onScrollDown() {
    this.skip.next({
      value: this.skip.value.value + this.mediasService.limit,
      propagate: true,
    });
  }
}
