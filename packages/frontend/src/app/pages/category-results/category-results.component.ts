import { Component, OnInit } from '@angular/core';
import { MediasService } from '../../shared/services/medias.service';
import { ListType, MediaWithType } from '../../shared/models/media.model';
import {ActivatedRoute} from "@angular/router";
import {map, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-category-results',
  templateUrl: './category-results.component.html',
})
export class CategoryResultsComponent implements OnInit {
  medias: MediaWithType[] = [];
  loading = true;

  constructor(private readonly mediasService: MediasService, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(map(({ name }) => name), switchMap((category) => this.mediasService.getMediasByCategory(category)), tap(() => this.loading = false)).subscribe((medias) => this.medias = medias);
  }
}
