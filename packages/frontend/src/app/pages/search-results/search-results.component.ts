import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaWithType } from '../../shared/models/media.model';
import { debounceTime, filter, Subject, switchMap, take, tap } from 'rxjs';
import { MediasService } from '../../shared/services/medias.service';
import { faBan, faSquareFull } from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';
import { SearchService } from '../../shared/services/search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  animations: [
    trigger('onNoData', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'TranslateY(-10px)',
        }),
        animate(
          '1s ease',
          style({
            opacity: 1,
            transform: 'TranslateY(0)',
          })
        ),
      ]),
    ]),
    trigger('onLoader', [
      transition(':leave', [
        style({
          opacity: 1,
        }),
        animate(
          '0.5s ease',
          style({
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class SearchResultsComponent implements OnInit {
  private _medias: MediaWithType[] = [];
  private _resize$ = new Subject<void>();
  mediasChunks: MediaWithType[][] = [];

  noData = false;
  loading = false;

  noDataIcon = faBan;
  mask = faSquareFull;

  search = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly mediasService: MediasService,
    private readonly searchService: SearchService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    this._resize$.next();
  }

  getLinesFromWidth(width: number): number {
    return width > 1200 ? 8 : width > 800 ? 6 : 4;
  }

  buildChunks(medias: MediaWithType[]): MediaWithType[][] {
    const perLines = this.getLinesFromWidth(window.innerWidth);
    const chunks = [];
    for (let i = 0; i < medias.length; i += perLines) {
      chunks.push(medias.slice(i, i + perLines));
    }
    return chunks;
  }

  ngOnInit(): void {
    this._resize$
      .pipe(debounceTime(50))
      .subscribe(() => (this.mediasChunks = this.buildChunks(this._medias)));
    this.route.queryParams
      .pipe(
        take(1),
        filter((q) => !!q)
      )
      .subscribe(({ q }) => (this.searchService.search = q));
    this.route.queryParams
      .pipe(
        filter(({ q }) => this.search !== q),
        tap(() => (this.loading = true)),
        tap(() => (this.noData = false)),
        tap(({ q }) => (this.search = q)),
        switchMap(({ q }) => this.mediasService.searchQuery(q, true)),
        tap((medias) => (this.noData = !medias.length)),
        tap((medias) => (this.mediasChunks = this.buildChunks(medias))),
        tap(() => (this.loading = false))
      )
      .subscribe((medias) => (this._medias = medias));
  }
}
