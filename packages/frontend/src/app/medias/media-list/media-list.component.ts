import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MediaWithType } from '../../shared/models/media.model';
import { BehaviorSubject, mergeMap } from 'rxjs';
import { ListType, MediasService } from '../../shared/services/medias.service';
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
          })
        ),
      ]),
      transition(
        ':leave',
        [
          style({
            transform: 'TranslateX(0%)',
          }),
          animate(
            '0.5s ease',
            style({
              transform: 'TranslateX({{transform}}%)',
            })
          ),
        ],
        { params: { transform: 0 } }
      ),
    ]),
  ],
})
export class MediaListComponent implements OnInit {
  @Input() type: ListType = ListType.ALL;
  @Output() mediaSelected = new EventEmitter<MediaWithType>();

  @ViewChild('scroller') scroller: ElementRef<HTMLDivElement> | null = null;

  medias: MediaWithType[] = [];

  skip: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  limit = 20;

  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  scroll = 800;

  chevronRightIcon = faChevronRight;
  chevronLeftIcon = faChevronLeft;

  get canScrollLeft() {
    return this.scroller && this.scroller.nativeElement.scrollLeft > 0;
  }

  get canScrollRight() {
    return (
      this.scroller &&
      this.scroller.nativeElement.scrollLeft +
        this.scroller.nativeElement.getBoundingClientRect().width <
        this.scroller.nativeElement.scrollWidth
    );
  }

  constructor(private readonly mediasService: MediasService) {}

  ngOnInit() {
    this.skip
      .pipe(mergeMap((skip) => this.mediasService.getMedias(this.type, skip)))
      .subscribe((medias) => (this.medias = [...this.medias, ...medias]));
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
    this.skip.next(this.skip.value + this.mediasService.limit);
  }
}
