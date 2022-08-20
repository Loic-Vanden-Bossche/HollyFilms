import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../shared/services/player.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, skip } from 'rxjs';
import { MediasService } from '../shared/services/medias.service';
import { MediaWithType } from '../shared/models/media.model';
import { ModalService } from '../shared/services/modal.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  animations: [
    trigger('playMode', [
      transition(
        ':enter',
        [
          style({
            height: '0px',
            width: '0px',
            top: '{{y}}px',
            left: '{{x}}px',
          }),
          animate(
            '0.7s ease',
            style({
              height: '100vh',
              width: '100vw',
              top: '0px',
              left: '0px',
            })
          ),
        ],
        {
          params: {
            top: '0em',
            left: '0em',
          },
        }
      ),
    ]),
  ],
})
export class PagesComponent implements OnInit {
  get playData() {
    return this.playerService.playerData;
  }

  get selectedMedia() {
    return this.mediasService.selectedMedia;
  }

  constructor(
    private readonly playerService: PlayerService,
    private readonly mediasService: MediasService,
    private readonly modalService: ModalService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  onPlayReady() {
    this.playerService.navigate();
  }

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

  openUserModal() {
    setTimeout(() => {
      this.modalService.open('userModal');
    }, 300);
  }

  ngOnInit() {
    this.openUserModal();
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

    this.route.queryParams.subscribe(({ mediaId }) => {
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
