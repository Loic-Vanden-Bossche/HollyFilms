import { Component } from '@angular/core';
import { ListType, MediaWithType } from '../../shared/models/media.model';
import { BehaviorSubject } from 'rxjs';

export interface MediaList {
  type: ListType;
  medias: MediaWithType[];
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
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

  set selectedMedia(media: MediaWithType | null) {
    this._selectedMedia = media;
  }

  get selectedMedia(): MediaWithType | null {
    return this._selectedMedia;
  }

  onNoData(type: ListType) {
    this.mediaLists.next(
      this.mediaLists.getValue().filter((mediaList) => mediaList.type !== type)
    );
  }
}
