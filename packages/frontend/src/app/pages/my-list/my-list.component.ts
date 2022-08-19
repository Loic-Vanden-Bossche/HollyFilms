import { Component, OnInit } from '@angular/core';
import { ListType, MediaWithType } from '../../shared/models/media.model';
import { MediasService } from '../../shared/services/medias.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
})
export class MyListComponent implements OnInit {
  medias: MediaWithType[] = [];

  constructor(private readonly mediasService: MediasService) {}

  ngOnInit(): void {
    this.mediasService
      .getAllMedias(ListType.INLIST)
      .subscribe((medias) => (this.medias = medias));
  }
}
