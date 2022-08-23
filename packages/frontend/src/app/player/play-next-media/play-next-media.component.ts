import { Component, Input, OnInit } from '@angular/core';
import {
  FeaturedType,
  MediaWithType,
  MediaWithTypeAndFeatured,
} from '../../shared/models/media.model';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { PlayerService } from '../../shared/services/player.service';
import { MediasService } from '../../shared/services/medias.service';

@Component({
  selector: 'app-play-next-media',
  templateUrl: './play-next-media.component.html',
})
export class PlayNextMediaComponent implements OnInit {
  @Input() media: MediaWithTypeAndFeatured | null = null;

  vendorTag = '';
  vendorIcon: IconDefinition | null = null;

  constructor(
    private readonly playerService: PlayerService,
    private readonly mediasService: MediasService
  ) {}

  getTagAndIconFromFeatured(featured: FeaturedType): [string, IconDefinition] {
    return this.mediasService.getTagAndIconFromFeatured(featured);
  }

  mediaPlayLink(media: MediaWithType) {
    return `/play/${media.data._id}${media.mediaType === 'tv' ? '/1/1' : ''}`;
  }

  onPlay(event: MouseEvent) {
    if (this.media) {
      this.playerService.play({
        mediaId: this.media.data._id,
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  ngOnInit(): void {
    if (this.media) {
      [this.vendorTag, this.vendorIcon] = this.getTagAndIconFromFeatured(
        this.media.featured
      );
    }
  }
}
