import { Component, OnInit } from '@angular/core';
import { MediasService } from '../../shared/services/medias.service';
import { MediaWithType } from '../../shared/models/media.model';
import { ModalService } from '../../shared/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  allMedias: MediaWithType[] = [];
  private _selectedMedia: MediaWithType | null = null;

  constructor(
    private readonly mediasService: MediasService,
    private modalService: ModalService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  set selectedMedia(media: MediaWithType | null) {
    if (media) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { mediaId: media.data._id },
      });
    } else {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { mediaId: null },
      });
    }

    this._selectedMedia = media;
  }

  get selectedMedia(): MediaWithType | null {
    return this._selectedMedia;
  }

  openModal(media: MediaWithType) {
    this.selectedMedia = media;
    this.modalService.open('mediaModal');
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const mediaId = params['mediaId'];
      if (mediaId) {
        this.mediasService
          .getMedia(mediaId)
          .pipe(
            catchError(() => {
              this.selectedMedia = null;
              return of(null);
            })
          )
          .subscribe((media) => {
            if (media) {
              this.openModal(media);
            }
          });
      }
    });

    this.mediasService.getMedias().subscribe((medias) => {
      this.allMedias = medias;
    });
  }
}
