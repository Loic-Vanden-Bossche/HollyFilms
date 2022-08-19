import { Component, Input, OnInit } from '@angular/core';
import {
  FeaturedType,
  MediaWithType,
  MediaWithTypeAndFeatured,
} from '../../shared/models/media.model';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowTrendUp,
  faBolt,
  faCirclePlay,
  faList,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-play-next-media',
  templateUrl: './play-next-media.component.html',
})
export class PlayNextMediaComponent implements OnInit {
  @Input() media: MediaWithTypeAndFeatured | null = null;

  vendorTag = '';
  vendorIcon: IconDefinition | null = null;

  getTagAndIconFromFeatured(featured: FeaturedType): [string, IconDefinition] {
    switch (featured) {
      case FeaturedType.CONTINUE:
        return [
          'Vous avez commencé ce film, continuer la lecture ?',
          faCirclePlay,
        ];
      case FeaturedType.INLIST:
        return ['Ceci est dans votre liste', faList];
      case FeaturedType.POPULAR:
        return ['Très populaire sur HollyFilms', faArrowTrendUp];
      case FeaturedType.RECENT:
        return ['Nouveau sur HollyFilms', faBolt];
      case FeaturedType.RECOMMENDED:
        return [' Recommandé pour vous', faUserCheck];
    }
  }

  mediaPlayLink(media: MediaWithType) {
    return `/play/${media.data._id}${media.mediaType === 'tv' ? '/1/1' : ''}`;
  }

  ngOnInit(): void {
    if (this.media) {
      [this.vendorTag, this.vendorIcon] = this.getTagAndIconFromFeatured(
        this.media.featured
      );
    }
  }
}
