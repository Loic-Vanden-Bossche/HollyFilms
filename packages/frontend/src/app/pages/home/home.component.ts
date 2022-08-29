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
    this.authService.onUserChanged().subscribe((user) => {
      if (!user) {
        return;
      }
      this.mediaLists.next([
        {
          type: ListType.RECOMMENDED,
          name: 'Recommandés pour vous',
          medias: [],
        },
        {
          type: ListType.POPULAR,
          name: 'Contenu populaire sur HollyFilms',
          medias: [],
        },
        { type: ListType.CONTINUE, name: 'Continuer la lecture', medias: [] },
        {
          type: ListType.RECENT,
          name: 'Récemment ajouté sur HollyFilms',
          medias: [],
        },
        {
          type: ListType.WATCHED,
          name: 'Revoir ce que vous avez vu',
          medias: [],
        },
        { type: ListType.LIKED, name: 'Contenu que vous aimez', medias: [] },
        { type: ListType.SERIES, name: 'Toutes les séries', medias: [] },
        { type: ListType.MOVIE, name: 'Tous les films', medias: [] },
        { type: ListType.INLIST, name: 'Dans ma liste', medias: [] },
        { type: ListType.ANIME, name: 'Animes', medias: [] },
        { type: ListType.ALL, name: 'Tout le contenu', medias: [] },
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
