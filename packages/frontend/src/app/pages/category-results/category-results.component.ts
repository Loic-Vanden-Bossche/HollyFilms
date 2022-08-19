import { Component, OnInit } from '@angular/core';
import { MediasService } from '../../shared/services/medias.service';
import { MediaWithType } from '../../shared/models/media.model';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-category-results',
  templateUrl: './category-results.component.html',
})
export class CategoryResultsComponent implements OnInit {
  medias: MediaWithType[] = [];
  loading = true;

  constructor(
    private readonly mediasService: MediasService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        map(({ names }) => names as string),
        distinctUntilChanged(),
        map((names) => names.split(',').filter((name) => name)),
        tap((names) =>
          !names.length ? this.router.navigate(['/home']) : void 0
        ),
        filter((names) => names.length > 0),
        switchMap((categories) =>
          this.mediasService.getMediasByCategory(categories)
        ),
        tap(() => (this.loading = false))
      )
      .subscribe((medias) => (this.medias = medias));
  }
}
