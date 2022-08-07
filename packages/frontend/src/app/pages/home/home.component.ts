import { Component, OnInit } from '@angular/core';
import { MediasService } from '../../shared/services/medias.service';
import { ListType, MediaWithType } from '../../shared/models/media.model';
import { ModalService } from '../../shared/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, of } from 'rxjs';

export interface MediaList {
  type: ListType;
  medias: MediaWithType[];
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private _selectedMedia: MediaWithType | null = null;

  mediaLists = new BehaviorSubject<MediaList[]>([
    { type: ListType.ALL, name: 'Tous les médias', medias: [] },
    { type: ListType.MOVIE, name: 'Films', medias: [] },
    { type: ListType.SERIES, name: 'Séries', medias: [] },
    { type: ListType.ANIME, name: 'Animes', medias: [] },
    { type: ListType.POPULAR, name: 'Populaires', medias: [] },
    { type: ListType.INLIST, name: 'Dans ma liste', medias: [] },
    { type: ListType.WATCHED, name: 'Vus', medias: [] },
    { type: ListType.LIKED, name: "J'aime", medias: [] },
    { type: ListType.RECENT, name: 'Récents', medias: [] },
    { type: ListType.RECOMMENDED, name: 'Recommandés', medias: [] },
    { type: ListType.CONTINUE, name: 'En cours', medias: [] },
  ]);

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

  onNoData(type: ListType) {
    // Delete the media list if it's empty
    this.mediaLists.next(
      this.mediaLists.getValue().filter((mediaList) => mediaList.type !== type)
    );
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
      } else {
        this.modalService.close('mediaModal');
        this.selectedMedia = null;
      }
    });
  }
}
