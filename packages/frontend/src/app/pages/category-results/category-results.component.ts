import { Component, OnInit } from '@angular/core';
import { MediasService } from '../../shared/services/medias.service';
import { ListType, MediaWithType } from '../../shared/models/media.model';

@Component({
  selector: 'app-category-results',
  templateUrl: './category-results.component.html',
})
export class CategoryResultsComponent implements OnInit {
  medias: MediaWithType[] = [];

  constructor(private readonly mediasService: MediasService) {}

  ngOnInit(): void {}
}
