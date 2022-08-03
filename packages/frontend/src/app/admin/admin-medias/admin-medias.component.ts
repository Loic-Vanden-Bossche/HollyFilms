import { Component, OnInit } from '@angular/core';
import { MediasService } from '../../shared/services/medias.service';
import { MediaWithType } from '../../shared/models/media.model';

@Component({
  selector: 'app-admin-medias',
  templateUrl: './admin-medias.component.html',
})
export class AdminMediasComponent implements OnInit {
  medias: MediaWithType[] = [];

  constructor(private readonly mediasService: MediasService) {}

  ngOnInit(): void {
    this.mediasService
      .getMedias()
      .subscribe((medias) => (this.medias = medias));
  }
}
