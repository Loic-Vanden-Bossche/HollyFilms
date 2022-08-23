import { Component, OnInit } from '@angular/core';
import {
  ListType,
  MediaWithType,
  MediaWithTypeAndFeatured,
} from '../../shared/models/media.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { shuffle } from '../../shared/utils';
import { MediasService } from '../../shared/services/medias.service';

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

  mediaLists = new BehaviorSubject<MediaList[]>([]);
  featured = new BehaviorSubject<MediaWithTypeAndFeatured[]>([]);

  set selectedMedia(media: MediaWithType | null) {
    this._selectedMedia = media;
  }

  get selectedMedia(): MediaWithType | null {
    return this._selectedMedia;
  }

  constructor(
    private readonly authService: AuthService,
    private readonly mediasService: MediasService
  ) {}

  ngOnInit() {
    this.authService.onUserChanged().subscribe(() => {
      this.mediaLists.next([
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

      this.mediasService
        .getFeaturedMedias()
        .subscribe((medias) => this.featured.next(shuffle(medias)));
    });
  }

  onNoData(type: ListType) {
    this.mediaLists.next(
      this.mediaLists.getValue().filter((mediaList) => mediaList.type !== type)
    );
  }
}
