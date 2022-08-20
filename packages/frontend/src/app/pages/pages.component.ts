import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, skip } from 'rxjs';
import { MediasService } from '../shared/services/medias.service';
import { MediaWithType } from '../shared/models/media.model';
import { ModalService } from '../shared/services/modal.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
})
export class PagesComponent implements AfterViewInit {
  get selectedMedia() {
    return this.mediasService.selectedMedia;
  }

  constructor(
    private readonly mediasService: MediasService,
    private readonly modalService: ModalService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  clearSelectedMedia() {
    this.mediasService.clearSelectedMedia();
  }

  openMediaModal(media: MediaWithType) {
    this.mediasService.selectMedia(media);
    this.modalService.open('mediaModal');
  }

  closeMediaModal() {
    this.modalService.close('mediaModal');
    this.clearSelectedMedia();
  }

  onUserModalClose() {
    this.router.navigate([], {
      queryParams: {
        userAccount: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  ngAfterViewInit() {
    this.mediasService.selectedMedia.pipe(skip(1)).subscribe((media) => {
      if (media) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { mediaId: media.data._id },
          queryParamsHandling: 'merge',
        });
      } else {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { mediaId: null },
          queryParamsHandling: 'merge',
        });
      }
    });

    this.route.queryParams.subscribe(({ mediaId, userAccount }) => {
      userAccount
        ? this.modalService.open('userModal')
        : this.modalService.close('userModal');

      if (mediaId) {
        this.mediasService
          .getMedia(mediaId)
          .pipe(catchError(() => of(null)))
          .subscribe((media) => {
            if (media) {
              this.openMediaModal(media);
            } else {
              this.closeMediaModal();
            }
          });
      } else {
        this.closeMediaModal();
      }
    });
  }
}
