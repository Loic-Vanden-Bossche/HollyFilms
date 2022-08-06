import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MediaWithType } from '../shared/models/media.model';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { MediasService } from '../shared/services/medias.service';

import * as videojs from 'video.js';
import { VideoJsPlayer } from 'video.js';
import { environment } from '../../environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  animations: [
    trigger('onPlay', [
      transition(':enter', [
        style({
          transform: 'Scale(2)',
          opacity: 0,
        }),
        animate(
          '2s ease',
          style({
            transform: 'Scale(1)',
            opacity: 1,
          })
        ),
      ]),
    ]),
  ],
})
export class PlayerComponent implements AfterViewInit {
  media: MediaWithType | null = null;

  private player: VideoJsPlayer | null = null;
  source: string | null = null;

  @ViewChild('player') playerElement: ElementRef | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly mediasService: MediasService
  ) {}

  ngAfterViewInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) =>
          this.mediasService.getMedia(params.get('mediaId') || '')
        )
      )
      .subscribe((medias) => {
        this.media = medias;
        this.source = this.media?.data._id
          ? `${environment.apiUrl}/medias/stream/secondary/${this.media?.data._id}/master.m3u8`
          : '';
        this.player = videojs.default(this.playerElement?.nativeElement, {
          bigPlayButton: false,
          autoplay: true,
          controlBar: {
            liveDisplay: false,
            seekToLive: false,
            pictureInPictureToggle: false,
          },
        });

        this.player.src({
          src: this.source,
          type: 'application/x-mpegURL',
          withCredentials: true,
        } as any);
      });
  }
}
