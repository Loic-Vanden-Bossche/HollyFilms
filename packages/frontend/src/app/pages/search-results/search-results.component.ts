import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaWithType } from '../../shared/models/media.model';
import { filter, switchMap, take, tap } from 'rxjs';
import { MediasService } from '../../shared/services/medias.service';
import { faBan, faSquareFull } from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';
import { SearchService } from '../../shared/services/search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  animations: [
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
  medias: MediaWithType[] = [];

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

  ngOnInit(): void {
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
        tap(() => (this.loading = false))
      )
      .subscribe((medias) => (this.medias = medias));
  }
}
