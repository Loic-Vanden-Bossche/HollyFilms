import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  MediaWithType,
  MediaWithTypeAndFeatured,
} from '../shared/models/media.model';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, Observable, sampleTime, switchMap } from 'rxjs';
import { MediasService } from '../shared/services/medias.service';

import * as videojs from 'video.js';
import { VideoJsPlayer } from 'video.js';
import { environment } from '../../environments/environment';
import { animate, style, transition, trigger } from '@angular/animations';
import { PlayerService } from '../shared/services/player.service';
import { PreviousRouteService } from '../shared/services/previous-route.service';
import {
  faChevronLeft,
  faChevronRight,
  faLeftLong,
} from '@fortawesome/free-solid-svg-icons';
import { TitleService } from '../shared/services/title.service';
import { UsersService } from '../shared/services/users.service';
import { AuthService } from '../shared/services/auth.service';
import { PlayedMedia } from '../shared/models/played-media.model';

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
    trigger('onContent', [
      transition(
        ':enter',
        [
          style({
            transform: 'TranslateX(100%)',
            opacity: 0,
          }),
          animate(
            '0.5s {{delay}}ms ease',
            style({
              transform: 'TranslateX(0%)',
              opacity: 1,
            })
          ),
        ],
        { params: { delay: '500' } }
      ),
      transition(':leave', [
        style({
          transform: 'TranslateX(0%)',
          opacity: 1,
        }),
        animate(
          '0.5s ease',
          style({
            transform: 'TranslateX(100%)',
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class PlayerComponent implements AfterViewInit, OnDestroy {
  media: MediaWithType | null = null;

  private player: VideoJsPlayer | null = null;
  source: string | null = null;

  returnUrl = { route: '/home', params: {} };

  @ViewChild('player') playerElement: ElementRef<HTMLElement> | null = null;
  @ViewChild('customPlayer')
  customPlayerElement: ElementRef<HTMLElement> | null = null;

  featuredMedias: MediaWithTypeAndFeatured[] = [];

  cueCount = 0;
  cueSet = false;

  displayFeatured = false;

  leftIcon = faLeftLong;
  chevronLeftIcon = faChevronLeft;
  chevronRightIcon = faChevronRight;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly playerService: PlayerService,
    private readonly mediasService: MediasService,
    private readonly usersService: UsersService,
    private readonly auth: AuthService,
    private readonly previousRouteService: PreviousRouteService,
    private readonly router: Router,
    private readonly title: TitleService
  ) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.player) {
      switch (event.key) {
        case 'ArrowLeft':
          this.player.currentTime(this.player.currentTime() - 5);
          break;
        case 'ArrowRight':
          this.player.currentTime(this.player.currentTime() + 5);
          break;
        case 'ArrowUp':
          this.player.volume(this.player.volume() + 0.1);
          break;
        case 'ArrowDown':
          this.player.volume(this.player.volume() - 0.1);
          break;
        case ' ':
          if (this.player?.paused()) {
            this.player?.play();
          } else {
            this.player?.pause();
          }
          break;
      }
    }
  }

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
    if (['fre', 'vff'].includes(code)) {
      return 'Français';
    } else if (['eng'].includes(code)) {
      return 'Anglais';
    }  else if (['jpn'].includes(code)) {
      return 'Japonais';
    } else if (['vfq'].includes(code)) {
      return 'Québécois';
    } else if (['spa'].includes(code)) {
      return 'Espagnol';
    } else if (['por'].includes(code)) {
      return 'Portugais';
    } else if (['ita'].includes(code)) {
      return 'Italien';
    } else if (['ger'].includes(code)) {
      return 'Allemand';
    } else if (['rus'].includes(code)) {
      return 'Russe';
    } else if (['chi'].includes(code)) {
      return 'Chinois';
    }

    return code;
  }

  setLanguageAsName() {
    if (this.player) {
      const audioTrackList = this.player.audioTracks();
      for (let i = 0; i < audioTrackList.length; i++) {
        (audioTrackList[i] as any).label = this.getLangFromCode(audioTrackList[i].language);
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

  getLocation(
    media: MediaWithType,
    seasonIndex?: number,
    episodeIndex?: number
  ) {
    if (seasonIndex === undefined || episodeIndex === undefined) {
      return media.data.fileInfos?.location;
    } else if (media.data.tvs) {
      const episodes = media.data.tvs[seasonIndex - 1].episodes;

      if (episodes) {
        return episodes[episodeIndex - 1].fileInfos?.location;
      }
    }

    return null;
  }

  onPlayedMediaUpdated(playedMedia: PlayedMedia) {
    if (this.media) {
      this.auth.updateUserProfile({
        playedMedias: this.usersService.getPlayedMediasFromPlayedMedia(
          this.auth.user?.playedMedias || [],
          playedMedia
        ),
      });
    }
  }

  ngOnDestroy() {
    this.player?.dispose();
  }

  ngAfterViewInit() {
    const prevRoute = this.previousRouteService.previousRoute;
    if (prevRoute !== this.router.url) {
      this.returnUrl.route =
        this.router.parseUrl(prevRoute).root.children[
          'primary'
        ].segments[0].path;
      this.returnUrl.params = this.router.parseUrl(prevRoute).queryParams;
    }

    this.mediasService
      .getFeaturedMedias()
      .subscribe((medias) => (this.featuredMedias = medias));

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
        const location =
          this.getLocation(
            media,
            seasonIndex ? parseInt(seasonIndex) : undefined,
            episodeIndex ? parseInt(episodeIndex) : undefined
          ) || 'default';
        this.media = media;
        this.source = this.media?.data._id
          ? `${environment.apiUrl}/medias/stream/${location}/${this.media?.data._id}/${tvIndexes}master.m3u8`
          : '';

        this.title.setTitle(this.media?.data.title || '');

        videojs.default.addLanguage('fr', {
          Play: 'Reprendre',
          Pause: 'Pause',
          'Current Time': 'Temps actuel',
          Duration: 'Durée',
          'Remaining Time': 'Temps restant',
          'Stream Type': 'Type de flux',
          LIVE: 'EN DIRECT',
          Loaded: 'Chargé',
          Progress: 'Progression',
          Fullscreen: 'Plein écran',
          'Non-Fullscreen': 'Plein écran',
          Mute: 'Muet',
          Unmute: 'Non muet',
          'Playback Rate': 'Vitesse de lecture',
          Subtitles: 'Sous-titres',
          'subtitles off': 'sous-titres désactivés',
          Captions: 'Sous-titres',
          'captions off': 'sous-titres désactivés',
          Chapters: 'Chapitres',
          'Close Modal Dialog': 'Fermer la boîte de dialogue',
          'You aborted the video playback':
            'Vous avez interrompu la lecture de la vidéo.',
          'A network error caused the video download to fail part-way.':
            'Une erreur de réseau a interrompu la lecture de la vidéo.',
          'The video could not be loaded, either because the server or network failed or because the format is not supported.':
            "La vidéo n'a pas pu être chargée à cause d'une erreur de réseau ou de format non supporté.",
          'The video playback was aborted due to a corruption problem or because the video used features your browser did not support.':
            "La lecture de la vidéo a été interrompue à cause d'un problème de corruption ou parce que la vidéo utilise des fonctionnalités non supportées par votre navigateur.",
          'No compatible source was found for this video.':
            "Aucune source compatible n'a été trouvée pour cette vidéo.",
        });

        this.player = videojs.default(
          this.playerElement?.nativeElement as Element,
          {
            bigPlayButton: false,
            autoplay: true,
            language: 'fr',
            textTrackSettings: false as any,
            controlBar: {
              liveDisplay: false,
              seekToLive: false,
              pictureInPictureToggle: false,
            },
          }
        );

        this.player.src({
          src: this.source,
          html5: {
            hls: {
              overrideNative: videojs.default.browser.IS_SAFARI,
            },
            nativeVideoTracks: !videojs.default.browser.IS_SAFARI,
            nativeAudioTracks: !videojs.default.browser.IS_SAFARI,
            nativeTextTracks: !videojs.default.browser.IS_SAFARI,
          },
          type: 'application/x-mpegURL',
          withCredentials: true,
        } as any);

        const si = seasonIndex ? parseInt(seasonIndex) : undefined;
        const ei = episodeIndex ? parseInt(episodeIndex) : undefined;

        const indexesParams = si && ei ? { si, ei } : {};

        this.customPlayerElement?.nativeElement.childNodes.forEach((node) => {
          this.playerElement?.nativeElement.parentElement?.insertBefore(
            node,
            this.playerElement?.nativeElement.parentElement?.getElementsByClassName(
              'vjs-control-bar'
            )[0]
          );
        });

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

        this.player.on('ended', () => (this.displayFeatured = true));

        this.player.on('texttrackchange', () => this.addOffset(1.2));
        this.player.on('seeked', () => {
          this.cueCount = 0;
          this.cueSet = false;
        });
      });
  }
}
