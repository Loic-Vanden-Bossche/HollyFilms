import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MediaWithType } from '../shared/models/media.model';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable, sampleTime, switchMap } from 'rxjs';
import { MediasService } from '../shared/services/medias.service';

import * as videojs from 'video.js';
import { VideoJsPlayer } from 'video.js';
import { environment } from '../../environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';
import { PlayerService } from '../shared/services/player.service';

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
    private readonly playerService: PlayerService,
    private readonly mediasService: MediasService
  ) {}

  cueCount = 0;
  cueSet = false;

  addOffset(offset: number) {
    if (this.player && !this.cueSet) {
      Array.from(this.player.textTracks()).forEach((track) => {
        if (track.mode === 'showing') {
          if (track.cues) {
            this.cueCount++;
            if (this.cueCount === 2) {
              this.cueSet = true;
              Array.from(track.cues).forEach((cue) => {
                cue.startTime += offset || 0.5;
                cue.endTime += offset || 0.5;
              });
            }
          }
        }
      });
    }
  }

  getLangFromCode(trigram: string) {
    const code = trigram.toLowerCase();
    if ('fre'.includes(code)) {
      return 'Français';
    } else if ('eng'.includes(code)) {
      return 'Anglais';
    } else if ('spa'.includes(code)) {
      return 'Espagnol';
    } else if ('por'.includes(code)) {
      return 'Portugais';
    } else if ('ita'.includes(code)) {
      return 'Italien';
    } else if ('ger'.includes(code)) {
      return 'Allemand';
    } else if ('rus'.includes(code)) {
      return 'Russe';
    } else if ('chi'.includes(code)) {
      return 'Chinois';
    }

    return 'Langue inconnue';
  }

  setLanguageAsName() {
    if (this.player) {
      const audioTrackList = this.player.audioTracks();
      for (let i = 0; i < audioTrackList.length; i++) {
        const track = audioTrackList[0];
        this.player.audioTracks().removeTrack(track);
        const newTrack = new videojs.default.AudioTrack({
          ...track,
          label: this.getLangFromCode(track.language),
          kind: 'main',
        });
        this.player.audioTracks().addTrack(newTrack as any);
      }
    }
  }

  setAudioTrackByIndex(index: number) {
    if (this.player) {
      const audioTrackList = this.player.audioTracks();
      for (let i = 0; i < audioTrackList.length; i++)
        audioTrackList[i].enabled = i === index;
    }
  }

  setTextTrackByIndex(index: number) {
    if (this.player) {
      const textTrackList = this.player.textTracks();
      for (let i = 0; i < textTrackList.length; i++)
        textTrackList[i].mode = i === index ? 'showing' : 'disabled';
    }
  }

  getAudioTrackIndex() {
    if (this.player) {
      const audioTrackList = this.player.audioTracks();
      for (let i = 0; i < audioTrackList.length; i++)
        if (audioTrackList[i].enabled) return i;
    }

    return -1;
  }

  onAudioTrackChange() {
    return new Observable((observer) =>
      this.player?.audioTracks().on('change', () => observer.next())
    ).pipe(map(() => this.getAudioTrackIndex()));
  }

  onTimeUpdate() {
    return new Observable((observer) =>
      this.player?.on('timeupdate', () => observer.next())
    ).pipe(
      sampleTime(2000),
      filter(() => !this.player?.paused()),
      map(() => Math.floor(this.player?.currentTime() || 0))
    );
  }

  getTextTrackIndex() {
    if (this.player) {
      const textTrackList = this.player.textTracks();
      for (let i = 0; i < textTrackList.length; i++)
        if (textTrackList[i].mode === 'showing') return i;
    }

    return -1;
  }

  onTextTrackChange() {
    return new Observable((observer) =>
      this.player
        ?.textTracks()
        .addEventListener('change', () => observer.next())
    ).pipe(map(() => this.getTextTrackIndex()));
  }

  ngAfterViewInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) =>
          this.mediasService.getMedia(params.get('mediaId') || '').pipe(
            map((media) => ({
              media,
              seasonIndex: params.get('seasonIndex'),
              episodeIndex: params.get('episodeIndex'),
            }))
          )
        )
      )
      .subscribe(({ media, episodeIndex, seasonIndex }) => {
        const tvIndexes =
          seasonIndex && seasonIndex ? `${seasonIndex}/${episodeIndex}/` : '';
        this.media = media;
        this.source = this.media?.data._id
          ? `${environment.apiUrl}/medias/stream/${
              this.media?.data.fileInfos?.location || 'default'
            }/${this.media?.data._id}/${tvIndexes}master.m3u8`
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

        const si = seasonIndex ? parseInt(seasonIndex) : undefined;
        const ei = episodeIndex ? parseInt(episodeIndex) : undefined;

        const indexesParams = si && ei ? { si, ei } : {};

        this.player.on('loadeddata', () => {
          this.setLanguageAsName();

          this.playerService
            .getPlayerStatus(this.media?.data._id || '', si, ei)
            .subscribe((data) => {
              if (data.currentTime !== undefined && data.currentTime >= 0) {
                this.player?.currentTime(data.currentTime);
              }

              if (data.audioTrack !== undefined && data.subtitleTrack !== -1) {
                this.setAudioTrackByIndex(data.audioTrack);
              }

              if (
                data.subtitleTrack !== undefined &&
                data.subtitleTrack !== -1
              ) {
                this.setTextTrackByIndex(data.subtitleTrack);
              }
            });

          this.onAudioTrackChange()
            .pipe(
              switchMap((index) =>
                this.playerService.track({
                  mediaId: this.media?.data._id || '',
                  ...indexesParams,
                  ai: index,
                })
              )
            )
            .subscribe();
          this.onTextTrackChange()
            .pipe(
              switchMap((index) =>
                this.playerService.track({
                  mediaId: this.media?.data._id || '',
                  ...indexesParams,
                  ti: index,
                })
              )
            )
            .subscribe();
          this.onTimeUpdate()
            .pipe(
              switchMap((time) =>
                this.playerService.track({
                  mediaId: this.media?.data._id || '',
                  ...indexesParams,
                  time,
                })
              )
            )
            .subscribe();
        });

        this.player.on('texttrackchange', () => this.addOffset(1.2));
        this.player.on('seeked', () => {
          this.cueCount = 0;
          this.cueSet = false;
        });
      });
  }
}
