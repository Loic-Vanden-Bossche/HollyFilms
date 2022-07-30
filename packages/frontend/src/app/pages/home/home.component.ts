import { Component, OnInit } from '@angular/core';
import { MediasService } from '../../shared/services/medias.service';
import { MediaWithType } from '../../shared/models/media.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  allMedias: MediaWithType[] = [];

  constructor(private readonly mediasService: MediasService) {}

  ngOnInit() {
    this.mediasService.getMedias().subscribe((medias) => {
      this.allMedias = medias;
    });
  }
}
