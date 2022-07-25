import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as os from 'os-utils';
import * as rimraf from 'rimraf';
import * as si from 'systeminformation';
import * as progress from 'request-progress';
import * as request from 'request';

import { EOL } from 'os';

import {BadRequestException, Injectable, NotFoundException, OnModuleInit} from "@nestjs/common";

import { MediasService } from 'src/medias/medias.service';
import { WebsocketService } from './websocket.service';
import { ffprobe } from 'fluent-ffmpeg';

import { env } from 'process';

type QueuedVideo = {
  fileName: string;
  id: string;
  mediaType: string;
  seasonIndex?: number;
  episodeIndex?: number;
};

type Queue = {
  videos: QueuedVideo[];
  index: 0;
  started: boolean;
};

@Injectable()
export class ProcessingService implements OnModuleInit {
  constructor(
    public readonly websocketService: WebsocketService,
    public readonly mediasService: MediasService
  ) {}

  onModuleInit() {
    this.purgeProcessingMedias();
  }

  startGeneration(id: string, name: string) {
    console.log('startGeneration', id, name);
    switch(name) {
      case 'cast':
        this.generateCastStreams(id);
        break;
      case 'thumbnails':
        this.generateThumbs(id);
        break
      case 'quality':
        this.generateExtraQualities(id, [1080, 720, 480, 360, 240]);
        break;
      default:
        throw new BadRequestException('Unknown generation type');
    }
  }

  async searchQuery(query: string): Promise<
    | void
    | {
        path: string;
        name: string;
        size: string;
        duration: string;
      }[]
  > {
    const filesTo = await this.getFiles(env.MEDIA_FILES_FOLDER);

    return await Promise.all(
      filesTo
        .filter((file) =>
          query
            .split(' ')
            .every((el) => file.name.toLowerCase().includes(el.toLowerCase())),
        )
        .map(async (c) => {
          const fileInfos = {
            fileData: await this.getFileData(c.path),
            stat: fs.statSync(c.path),
          };

          return {
            path: c.path,
            name: c.name,
            size: this.convertBytes(fileInfos.stat.size),
            duration: this.getRuntime(fileInfos.fileData.format.duration / 60),
          };
        }),
    ).catch((err) => {
      console.log(err);
    });
  }

  getFileData(file: string): Promise<ffmpeg.FfprobeData> {
    return new Promise((resolve, reject) => {
      ffprobe(file, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  }

  getRuntime(seconds: number): string {
    const MINUTES = seconds;

    const m = MINUTES % 60;
    const h = (MINUTES - m) / 60;

    if (h > 0) {
      return (
        Math.floor(h).toString() +
        'h' +
        (m
          ? m < 10
            ? '0' + Math.floor(m).toString()
            : Math.floor(m).toString()
          : '')
      );
    } else {
      return Math.floor(m).toString() + 'min';
    }
  }

  convertBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (bytes == 0) {
      return 'n/a';
    }

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    if (i == 0) {
      return bytes + ' ' + sizes[i];
    }

    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  }

  async getFiles(path = './'): Promise<
    {
      path: string;
      name: string;
    }[]
  > {
    const entries = fs.readdirSync(path, {
      withFileTypes: true,
    });

    const files = entries
      .filter((file) => !file.isDirectory())
      .map((file) => ({
        ...file,
        path: path + '/' + file.name,
      }));

    const folders = entries.filter((folder) => folder.isDirectory());

    for (const folder of folders)
      files.push(...(await this.getFiles(`${path}/${folder.name}/`)));

    return files;
  }

  //-------------------------------------------------------------------//

  queue: Queue = {
    videos: [],
    index: 0,
    started: false,
  };

  progressStatus: {
    mainStatus: string;
    mainMsg: string;
    streamsStatus: {
      type: string;
      tag: string;
      data?: any;
      prog?: number;
      index?: number;
      stringToAppend?: string;
      lang?: string;
    }[];
    fileInfos: any;
  }

  masterFileName = 'master.m3u8';

  getQueue() {
    return this.queue;
  }

  addToQueue(video: QueuedVideo) {
    this.queue.videos.push(video);
  }

  startQueue() {
    this.processMedia(this.queue.videos[0]);
  }

  async clearQueue(): Promise<boolean> {
    const isMovies = this.queue.videos.filter(
      (video) => video.mediaType == 'movie',
    ).length;

    if (this.queue.videos.length) {
      if (!this.queue.started) {
        this.queue.videos = [];

        if (isMovies) {
          await this.purgeProcessingMedias();
        } else {
          return false;
        }
      } else {
        if (isMovies) {
          this.queue.videos.splice(1, this.queue.videos.length);
          await this.purgeProcessingMedias(this.queue.videos[0].id);
        } else {
          return false;
        }
      }
    }

    return true;
  }

  async getSiInfos() {
    if (this.progressStatus) {
      this.websocketService.emit('si-data', {
        cpuTemp: (await si.cpuTemperature()).main,
        cpuUsage: await (async function () {
          return new Promise((resolve) => {
            os.cpuUsage((data) => {
              resolve(Math.round(data * 100));
            });
          });
        })(),
      });

      this.getSiInfos();
    }
  }

  washFiles(path: string): boolean {
    if (fs.existsSync(path)) {
      rimraf.sync(path);

      return true;
    }

    return false;
  }

  getFolderSize(folderPath: string) {
    const files = fs.readdirSync(folderPath);
    let totalSizeBytes = 0;

    for (let i = 0; i < files.length; i++) {
      const stats = fs.statSync(folderPath + files[i]);

      if (stats.isFile()) {
        totalSizeBytes += stats.size;
      }
    }

    return totalSizeBytes;
  }

  async purgeProcessingMedias(except?: string) {
    let medias = await this.mediasService.getMedias();

    /*medias = medias.filter((media) => {
      return (
        media.mediaType === 'movie' &&
        media.data['fileInfos'].isProcessing === true &&
        this.mediasService.getId(media.data) !== except
      );
    });*/

    for (const media of medias) {
      if (media.mediaType === 'movie') {
        // this.moviesService.delete(this.mediasService.getId(media.data));

       /* if (
          !this.washFiles(
            env.MEDIAS_LOCATION_DEFAULT +
              '/' +
              this.mediasService.getId(media.data),
          )
        ) {
          this.washFiles(
            env.MEDIAS_LOCATION_SECONDARY +
              '/' +
              this.mediasService.getId(media.data),
          );
        }*/
        console.log('deletingData');
      } else {
        console.log('This is a TV');
      }
    }
  }

  processLocation = 'secondary';

  getInitialLocation(): string {
    return this.processLocation == 'default'
      ? env.MEDIAS_LOCATION_DEFAULT
      : this.processLocation == 'secondary'
      ? env.MEDIAS_LOCATION_SECONDARY
      : null;
  }

  async processMedia(inputVideo: QueuedVideo) {
    //--------- In method functions ---------

    const finalizeProcess = async () => {

      await this.generateCastStreams(inputVideo.id, false);

      this.progressStatus.mainStatus = 'ENDED';
      this.progressStatus.mainMsg = 'processing ended';
      this.progressStatus.streamsStatus = [];

      this.queue.started = false;

      if (inputVideo.seasonIndex && inputVideo.episodeIndex) {
        /*this.tvsService.updateOne(
          inputVideo.id,
          {
            $set: {
              'seasons.$[outer].episodes.$[inner].dateAdded': new Date(),
              'seasons.$[outer].episodes.$[inner].avaliable': true,
              'seasons.$[outer].episodes.$[inner].runtime': Math.round(
                this.progressStatus.fileInfos.Sduration / 60,
              ),
              'seasons.$[outer].episodes.$[inner].fileInfos.isProcessing':
                false,
              'seasons.$[outer].episodes.$[inner].fileInfos.maxQualilty':
                this.progressStatus.fileInfos.maxQualilty,
              'seasons.$[outer].episodes.$[inner].fileInfos.audioLangAvaliables':
                this.progressStatus.fileInfos.audioLangAvaliables,
              'seasons.$[outer].episodes.$[inner].fileInfos.maxQualiltyTag':
                this.progressStatus.fileInfos.maxQualiltyTag,
              'seasons.$[outer].episodes.$[inner].fileInfos.Sduration':
                this.progressStatus.fileInfos.Sduration,
              'seasons.$[outer].episodes.$[inner].fileInfos.location':
                this.processLocation,
            },
          },
          {
            arrayFilters: [
              {
                'outer.index': inputVideo.seasonIndex,
              },
              {
                'inner.index': inputVideo.episodeIndex,
              },
            ],
          },
        );*/
      } else {
        /*this.moviesService.updateOne(inputVideo.id, {
          $set: {
            dateAdded: new Date(),
            runtime: Math.round(this.progressStatus.fileInfos.Sduration / 60),
            'fileInfos.isProcessing': false,
            'fileInfos.maxQualilty': this.progressStatus.fileInfos.maxQualilty,
            'fileInfos.audioLangAvaliables':
              this.progressStatus.fileInfos.audioLangAvaliables,
            'fileInfos.maxQualiltyTag':
              this.progressStatus.fileInfos.maxQualiltyTag,
            'fileInfos.Sduration': this.progressStatus.fileInfos.Sduration,
            'fileInfos.location': this.processLocation,
          },
        });*/
      }

      this.queue.videos.shift();

      this.websocketService.emit('processing-media', this.progressStatus);

      this.progressStatus = null;

      setTimeout(() => {
        this.processMedia(this.queue.videos[0]);
      }, 200);
    };

    const emitProcessEvent = async () => {
      const isEnded = await checkProcess();

      if (isEnded) {
        finalizeProcess();
      } else {
        this.websocketService.emit('processing-media', this.progressStatus);
      }
    };

    const checkProcess = async (): Promise<boolean> => {
      if (
        endedStreams + endedStreamsWErrors == startedStreams &&
        startedStreams &&
        !ended
      ) {
        ended = true;
        writeMasterFile();
        writeFileInfo();

        switch (renderSelected) {
          case 'FULL':
            await this.generateThumbs(inputVideo.id);
            await this.generateExtraQualities(
              inputVideo.id,
              [1080, 720, 480, 360],
            );

            break;
          case 'HALF':
            await this.generateThumbs(inputVideo.id);

            break;
        }

        return true;
      }

      return false;
    };

    function getLang(stream) {
      let langTag = '';
      let lang = '';

      if (stream.tags.language) {
        lang = stream.tags.language.toUpperCase();
      } else {
        lang = 'unknown';
      }

      if (stream.tags.title) {
        const title = stream.tags.title.toUpperCase();

        switch (true) {
          case title.includes('VFF') || title.includes('FR'):
            langTag = 'VFF';
            break;

          case title.includes('VFQ') || title.includes('QC'):
            langTag = 'VFQ';
            break;

          case title.includes('VO') ||
            title.includes('ENG') ||
            lang.includes('ENG'):
            langTag = 'ENG';
            break;

          default:
            langTag = lang;
            break;
        }

        return langTag;
      } else {
        return lang;
      }
    }

    const getLargestVideoStream = () => {
      const largestVideo = Math.max(
        ...this.progressStatus.streamsStatus
          .filter((stream) => stream.type == 'video')
          .map((obj) => {
            return this.getFolderSize(folderName + obj.index + '_video/');
          }),
      );

      for (const stream of this.progressStatus.streamsStatus.filter(
        (stream) => stream.type == 'video',
      )) {
        if (
          this.getFolderSize(folderName + stream.index + '_video/') >=
          largestVideo
        )
          return stream;
      }
    };

    function getUnique(array) {
      const uniqueArray = [];

      for (let i = 0; i < array.length; i++) {
        if (uniqueArray.indexOf(array[i]) === -1) {
          uniqueArray.push(array[i]);
        }
      }
      return uniqueArray;
    }

    const writeMasterFile = () => {
      largestVideoStream = getLargestVideoStream();

      fs.writeFileSync(
        folderName + this.masterFileName,
        '#EXTM3U\n#EXT-X-VERSION:6\n\n',
      );

      const largestSubtitle = Math.max(
        ...this.progressStatus.streamsStatus
          .filter((stream) => stream.type == 'subtitle')
          .map((obj) => {
            return fs.statSync(
              folderName +
                obj.index +
                '_subtitle/' +
                obj.index +
                '_subtitle_stream.vtt',
            ).size;
          }),
      );

      for (const lang of getUnique(
        this.progressStatus.streamsStatus
          .filter((stream) => stream.type == 'subtitle')
          .map((obj) => {
            return obj.lang;
          }),
      )) {
        const langArr = this.progressStatus.streamsStatus.filter(
          (stream) => stream.type == 'subtitle' && stream.lang == lang,
        );

        const largestSubtitleByLang = Math.max(
          ...langArr.map((obj) => {
            return fs.statSync(
              folderName +
                obj.index +
                '_subtitle/' +
                obj.index +
                '_subtitle_stream.vtt',
            ).size;
          }),
        );

        for (const stream of langArr) {
          const subtitleSize = fs.statSync(
            folderName +
              stream.index +
              '_subtitle/' +
              stream.index +
              '_subtitle_stream.vtt',
          ).size;

          if (
            subtitleSize == largestSubtitleByLang &&
            subtitleSize >= largestSubtitle / 2
          ) {
            fs.appendFileSync(
              folderName + this.masterFileName,
              stream.stringToAppend,
            );
          } else {
            this.washFiles(folderName + stream.index + '_subtitle/');
          }
        }
      }

      fs.appendFileSync(folderName + this.masterFileName, '\n');

      for (const stream of this.progressStatus.streamsStatus.filter(
        (stream) => stream.type == 'audio',
      )) {
        fs.appendFileSync(
          folderName + this.masterFileName,
          stream.stringToAppend,
        );
      }

      for (const stream of this.progressStatus.streamsStatus.filter(
        (stream) =>
          stream.type == 'video' && stream.index != largestVideoStream.index,
      )) {
        this.washFiles(folderName + stream.index + '_video/');
      }

      fs.appendFileSync(
        folderName + this.masterFileName,
        largestVideoStream.stringToAppend,
      );
    };

    const writeFileInfo = () => {
      this.progressStatus.fileInfos = {
        maxQualilty: Math.round(0.5625 * largestVideoStream.data.width),
        audioLangAvaliables: getUnique(
          fileData.streams
            .filter((stream) => stream.codec_type == 'audio')
            .map((obj) => {
              return obj.tags.language;
            }),
        ),
        maxQualiltyTag: null,
        Sduration: Math.round(fileData.format.duration),
      };

      if (this.progressStatus.fileInfos.maxQualilty >= 2160) {
        this.progressStatus.fileInfos.maxQualiltyTag = 'UHD';
      } else if (this.progressStatus.fileInfos.maxQualilty >= 1440) {
        this.progressStatus.fileInfos.maxQualiltyTag = 'QHD';
      } else if (this.progressStatus.fileInfos.maxQualilty >= 1080) {
        this.progressStatus.fileInfos.maxQualiltyTag = 'FHD';
      } else if (this.progressStatus.fileInfos.maxQualilty >= 720) {
        this.progressStatus.fileInfos.maxQualiltyTag = 'HD';
      } else if (this.progressStatus.fileInfos.maxQualilty >= 480) {
        this.progressStatus.fileInfos.maxQualiltyTag = 'SD';
      }
    };

    //---------------------------------------

    if (!inputVideo || this.queue.started) return;

    const renderModes = ['FULL', 'HALF', 'FAST'];

    const renderSelected = renderModes[2];

    this.queue.started = true;

    console.log('processing ' + inputVideo.fileName + 'in ' + inputVideo.id);

    let startedStreams = 0;
    let endedStreams = 0;
    let endedStreamsWErrors = 0;
    let ended = false;

    this.progressStatus = {
      mainStatus: 'STARTING',
      mainMsg: 'Initializing prossesing unit',
      fileInfos: null,
      streamsStatus: [],
    };

    await emitProcessEvent();
    this.getSiInfos();

    if (inputVideo.fileName.includes('http')) {
      this.progressStatus = {
        mainStatus: 'DOWNLOADING',
        mainMsg: 'Downloading video file',
        fileInfos: null,
        streamsStatus: [],
      };

      emitProcessEvent();

      await (() => {
        return new Promise<void>((resolve, reject) => {
          progress(request(inputVideo.fileName), {})
            .on('progress', (state) => {
              state.speed = state.speed
                ? this.convertBytes(state.speed) + '/s'
                : null;
              this.websocketService.emit('processing-videoDownload', state);
            })
            .on('error', function (err) {
              reject(err);
            })
            .on('end', () => {
              resolve();
              inputVideo.fileName = 'temp.mkv';
              this.websocketService.emit('processing-videoDownload', null);
            })
            .pipe(fs.createWriteStream('temp.mkv'));
        });
      })();
    }

    let fileData;

    let largestVideoStream;

    const folderName =
      this.getInitialLocation() +
      '/' +
      inputVideo.id +
      '/' +
      (inputVideo.seasonIndex ? inputVideo.seasonIndex + '/' : '') +
      (inputVideo.episodeIndex ? inputVideo.episodeIndex + '/' : '');

    fs.existsSync(folderName) ||
      fs.mkdirSync(folderName, {
        recursive: true,
      });

    ffprobe(inputVideo.fileName, (err, data) => {
      fileData = data;

      if (err) {
        console.log(err);
      } else {
        this.progressStatus.mainStatus = 'PROCESSING';
        this.progressStatus.mainMsg = 'Processing streams';

        emitProcessEvent();

        for (const stream of data.streams) {
          switch (stream.codec_type) {
            case 'video':
              this.progressStatus.streamsStatus[stream.index] = {
                type: 'video',
                tag: 'video',
                data: stream,
                prog: 0,
              };

              fs.existsSync(folderName + stream.index + '_video') ||
                fs.mkdirSync(folderName + stream.index + '_video');

              startedStreams++;

              const codecToUse = stream.codec_name == 'hevc' ? 'h264' : 'copy';

              if (codecToUse == 'h264')
                this.progressStatus.mainMsg =
                  'Processing streams : could be very long (HEVC)';

              ffmpeg(inputVideo.fileName)
                .addOption([
                  '-map 0:' + stream.index,
                  '-c ' + codecToUse,
                  '-f hls',
                  '-hls_time 10',
                  '-hls_playlist_type event',
                  '-hls_flags independent_segments',
                  '-hls_segment_filename ' +
                    folderName +
                    stream.index +
                    '_video/' +
                    stream.index +
                    '_video_data%06d.ts',
                ])
                .output(
                  folderName +
                    stream.index +
                    '_video/' +
                    stream.index +
                    '_video_stream.m3u8',
                )
                .on('progress', (progress) => {
                  this.progressStatus.streamsStatus[stream.index].prog =
                    progress.percent;
                  emitProcessEvent();
                })
                .on('error', (err) => {
                  console.log(err);

                  endedStreamsWErrors++;
                  emitProcessEvent();
                })
                .on('end', () => {
                  const bitrate = Math.round(
                    (this.getFolderSize(folderName + stream.index + '_video/') /
                      Math.pow(10, 9) /
                      ((data.format.duration / 60) * 0.0075)) *
                      Math.pow(10, 6),
                  );

                  this.progressStatus.streamsStatus[stream.index].prog = 100;
                  this.progressStatus.streamsStatus[stream.index].index =
                    stream.index;
                  this.progressStatus.streamsStatus[
                    stream.index
                  ].stringToAppend =
                    '\n#EXT-X-STREAM-INF:BANDWIDTH=' +
                    bitrate +
                    ',' +
                    'RESOLUTION=' +
                    stream.width +
                    'x' +
                    stream.height +
                    ',' +
                    'CODECS="avc1.640028,mp4a.40.2",' +
                    'AUDIO="group_audio128",' +
                    'SUBTITLES="subs"\n' +
                    stream.index +
                    '_video/' +
                    stream.index +
                    '_video_stream.m3u8\n';

                  endedStreams++;
                  emitProcessEvent();
                })
                .run();

              break;

            case 'audio':
              this.progressStatus.streamsStatus[stream.index] = {
                type: 'audio',
                tag: 'audio',
                data: stream,
                prog: 0,
                lang: stream.tags.language,
              };

              emitProcessEvent();

              fs.existsSync(folderName + stream.index + '_audio') ||
                fs.mkdirSync(folderName + stream.index + '_audio');

              startedStreams++;

              const codecToApply =
                stream.codec_name != 'aac' || stream.channels > 6
                  ? 'aac'
                  : 'copy';
              const effectiveChannels =
                stream.channels > 6 ? 6 : stream.channels;

              ffmpeg(inputVideo.fileName)
                .addOption([
                  '-map 0:' + stream.index,
                  '-c ' + codecToApply,
                  '-ac ' + effectiveChannels,
                  '-f hls',
                  '-hls_time 10',
                  '-hls_playlist_type event',
                  '-hls_segment_filename ' +
                    folderName +
                    stream.index +
                    '_audio/' +
                    stream.index +
                    '_audio_data%06d.ts',
                ])
                .output(
                  folderName +
                    stream.index +
                    '_audio/' +
                    stream.index +
                    '_audio_stream.m3u8',
                )
                .on('progress', (progress) => {
                  this.progressStatus.streamsStatus[stream.index].prog =
                    progress.percent;
                  emitProcessEvent();
                })
                .on('error', (err) => {
                  console.log(err);

                  endedStreamsWErrors++;
                  emitProcessEvent();
                })
                .on('end', () => {
                  this.progressStatus.streamsStatus[stream.index].prog = 100;
                  this.progressStatus.streamsStatus[stream.index].index =
                    stream.index;
                  this.progressStatus.streamsStatus[
                    stream.index
                  ].stringToAppend =
                    '#EXT-X-MEDIA:TYPE=AUDIO,' +
                    'GROUP-ID="group_audio128",' +
                    'NAME="audio' +
                    stream.index +
                    '",' +
                    'DEFAULT=YES,' +
                    'LANGUAGE="' +
                    getLang(stream) +
                    '",' +
                    'CHANNELS="' +
                    effectiveChannels +
                    '",' +
                    'URI="' +
                    stream.index +
                    '_audio/' +
                    stream.index +
                    '_audio_stream.m3u8"\n';

                  endedStreams++;
                  emitProcessEvent();
                })
                .run();

              break;

            case 'subtitle':
              if (stream.codec_name != 'hdmv_pgs_subtitle') {
                this.progressStatus.streamsStatus[stream.index] = {
                  type: 'subtitle',
                  tag: 'subtitle',
                  data: stream,
                  prog: 0,
                  lang: stream.tags.language,
                };

                startedStreams++;

                emitProcessEvent();

                fs.existsSync(folderName + stream.index + '_subtitle') ||
                  fs.mkdirSync(folderName + stream.index + '_subtitle');

                ffmpeg(inputVideo.fileName)
                  .addOption(['-map 0:' + stream.index, '-c webvtt'])
                  .output(
                    folderName +
                      stream.index +
                      '_subtitle/' +
                      stream.index +
                      '_subtitle_stream.vtt',
                  )
                  .on('progress', (progress) => {
                    this.progressStatus.streamsStatus[stream.index].prog =
                      progress.percent;
                    emitProcessEvent();
                  })
                  .on('error', (err) => {
                    console.log(err);

                    emitProcessEvent();
                  })
                  .on('end', () => {
                    this.progressStatus.streamsStatus[stream.index].prog = 100;
                    this.progressStatus.streamsStatus[stream.index].index =
                      stream.index;
                    this.progressStatus.streamsStatus[
                      stream.index
                    ].stringToAppend =
                      '#EXT-X-MEDIA:TYPE=SUBTITLES,' +
                      'GROUP-ID="subs",' +
                      'NAME="' +
                      stream.tags.language +
                      '",' +
                      'DEFAULT=NO,' +
                      'LANGUAGE="' +
                      stream.tags.language +
                      '",' +
                      'FORCED=NO,' +
                      'URI="' +
                      stream.index +
                      '_subtitle/' +
                      stream.index +
                      '_subtitle_stream.m3u8",' +
                      'LANGUAGE="' +
                      stream.tags.language +
                      '",\n';

                    fs.writeFileSync(
                      folderName +
                        stream.index +
                        '_subtitle/' +
                        stream.index +
                        '_subtitle_stream.m3u8',
                      '#EXTM3U\n' +
                        '#EXT-X-VERSION:3\n' +
                        '#EXT-X-TARGETDURATION:10\n' +
                        '#EXT-X-MEDIA-SEQUENCE:0\n' +
                        '#EXT-X-PLAYLIST-TYPE:EVENT\n' +
                        '#EXTINF:10.005333,\n' +
                        stream.index +
                        '_subtitle_stream.vtt\n' +
                        '#EXT-X-ENDLIST\n',
                    );

                    endedStreams++;
                    emitProcessEvent();
                  })
                  .run();
              }

              break;
          }
        }
      }
    });
  }

  async generateExtraQualities(
    videoId: string,
    extraQualitiesValues: number[],
  ) {
    const folderName = this.getInitialLocation() + '/' + videoId + '/';
    const fileData = await this.getFileData(folderName + this.masterFileName);
    const videoData = fileData.streams.filter(
      (stream) => stream.codec_type == 'video',
    )[0];

    const srcQuality = Math.round(0.5625 * videoData.width);

    const extraQualities = extraQualitiesValues
      .filter((quality) => quality != srcQuality)
      .map((quality, index) => {
        return {
          res: quality,
          hres:
            Math.round(
              (quality * 1.77777778) / (videoData.width / videoData.height) / 2,
            ) * 2,
          wres: Math.round((quality * 1.77777778) / 2) * 2,
          streamIndex: index + this.progressStatus.streamsStatus.length,
          index: index,
          stringToAppend: null,
        };
      });

    let startedStreams = 0;
    let endedStreams = 0;

    return new Promise<void>((resolve, reject) => {
      const emitProcessEvent = () => {
        this.websocketService.emit('processing-media', this.progressStatus);

        if (endedStreams == startedStreams && startedStreams) {
          /*this.moviesService.updateOne(videoId, {
            $set: {
              'fileInfos.extraQualities': extraQualities.map((obj) => {
                return obj.res;
              }),
            },
          });*/

          console.log(extraQualities);

          for (const quality of extraQualities) {
            fs.appendFileSync(
              folderName + this.masterFileName,
              quality.stringToAppend,
            );
          }

          return resolve();
        }
      };

      this.progressStatus.mainMsg = 'Generating extra qualities';
      emitProcessEvent();

      for (const quality of extraQualities) {
        this.progressStatus.streamsStatus.push({
          type: 'video',
          tag: quality.res + 'p',
          prog: 0,
        });

        startedStreams++;

        fs.existsSync(folderName + quality.streamIndex + '_video/') ||
          fs.mkdirSync(folderName + quality.streamIndex + '_video/');

        const filter = 'scale=' + quality.hres + ':' + quality.wres;

        ffmpeg(folderName + 'master.m3u8')
          .addOption([
            '-map 0:v:0',
            '-vf ' + filter,
            '-c h264',
            '-preset fast',
            '-crf 20',
            '-f hls',
            '-hls_time 10',
            '-hls_playlist_type event',
            '-hls_flags independent_segments',
            '-hls_segment_filename ' +
              folderName +
              quality.streamIndex +
              '_video/' +
              quality.streamIndex +
              '_video_data%06d.ts',
          ])
          .output(
            folderName +
              quality.streamIndex +
              '_video/' +
              quality.streamIndex +
              '_video_stream.m3u8',
          )
          .on('progress', (progress) => {
            this.progressStatus.streamsStatus[quality.streamIndex].prog =
              progress.percent;
            emitProcessEvent();
          })
          .on('error', (err) => {
            if (err) throw err;

            emitProcessEvent();

            return reject(err);
          })
          .on('end', () => {
            endedStreams++;

            const bitrate = Math.round(
              (this.getFolderSize(
                folderName + quality.streamIndex + '_video/',
              ) /
                Math.pow(10, 9) /
                ((fileData.format.duration / 60) * 0.0075)) *
                Math.pow(10, 6),
            );

            extraQualities[quality.index].stringToAppend =
              '\n#EXT-X-STREAM-INF:BANDWIDTH=' +
              bitrate +
              ',' +
              'RESOLUTION=' +
              quality.wres +
              'x' +
              quality.hres +
              ',' +
              'CODECS="avc1.640028,mp4a.40.2",' +
              'AUDIO="group_audio128",' +
              'SUBTITLES="subs"\n' +
              quality.streamIndex +
              '_video/' +
              quality.streamIndex +
              '_video_stream.m3u8\n';

            this.progressStatus.streamsStatus[quality.streamIndex].prog = 100;
            emitProcessEvent();
          })
          .run();
      }
    });
  }

  async generateCastStreams(videoId: string, resetStatus: boolean = true) {

    const getDirectories = (path) => {
      return fs.readdirSync(path).filter((file) => {
        return fs.statSync(path + "/" + file).isDirectory();
      });
    };

    const replacementLang = (textArray: Array<string>, text: string) => {

      const isQC = (lang: string) => {
        return lang === 'VFQ' || lang === 'QC';
      };

      const isFR = (lang: string) => {
        return lang === 'VFF' || lang === 'VF' || lang === 'FRE';
      };

      const getLang = (text: string) => {
        return text.match(/LANGUAGE="[^"]*"/g)[0].match(/"[^"]*/g)[0].replace('"', '');
      }

      const langArray = textArray
      .map(text => getLang(text));

      const fr = langArray.some(lang => isFR(lang));
      const qc = langArray.some(lang => isQC(lang));

      const textLang = getLang(text);

      const isDefault =
        isFR(textLang)
          ? true
          : !fr && isQC(textLang)
            ? true
            : !fr && !qc;

      return text.replace('YES', isDefault ? 'YES' : 'NO');
    }

    return new Promise<void>(async (resolve, reject) => {

      if(!this.progressStatus) {
        this.progressStatus = {
          mainStatus: 'IDLE',
          mainMsg: 'IDLE',
          fileInfos: null,
          streamsStatus: [],
        };
      }

      let endedStreams = 0;
      let textToAppend = [];

      const folderName = this.getInitialLocation() + '/' + videoId + '/';
      const audioDirectories = getDirectories(this.getInitialLocation() + '/' + videoId + '/').filter(
        (subDir) => subDir.includes("audio") && !subDir.includes("cast")
      );
      if (!audioDirectories.length) reject("Error : no audio stream found");

      this.progressStatus.mainMsg = `generating cast streams`;
      this.websocketService.emit('processing-media', this.progressStatus);

      for (const [index, audioDir] of audioDirectories.entries()) {
        new Promise<void>((resolveFile) => {

          this.progressStatus.streamsStatus.push({
            type: 'audio',
            tag: 'cast-audio',
            prog: 0,
          });

          this.websocketService.emit('processing-media', this.progressStatus);

          const streamIndex = this.progressStatus.streamsStatus.length - 1;

          const fullAudioDir = folderName + audioDir;
          const tempAudioDir = folderName + audioDir + "-cast";

          if (!fs.existsSync(tempAudioDir)) fs.mkdirSync(tempAudioDir);

          const m3u8File =
            fullAudioDir +
            "/" +
            fs
            .readdirSync(fullAudioDir)
            .filter((file) => file.includes(".m3u8"))[0];

          ffmpeg(m3u8File)
          .addOption([
            "-c aac",
            "-ac 2",
            "-f hls",
            "-hls_time 10",
            '-hls_playlist_type event',
            "-segment_format mpegts",
            "-hls_segment_filename " +  tempAudioDir + "/" + audioDir + "_data%06d.ts"
          ])
          .output(tempAudioDir + "/" + audioDir + "_stream.m3u8")
          .on("progress", (progress) => {
            this.progressStatus.streamsStatus[streamIndex].prog = progress.percent;
            this.websocketService.emit('processing-media', this.progressStatus);
          })
          .on("error", (err) => {
            console.log("An error occurred: " + err.message);
          })
          .on("end", () => {

            endedStreams++;

            const fileContent = fs.readFileSync(folderName + 'master.m3u8').toString();
            const selectedLine = fileContent.split('\n').find((line) => line.includes(audioDir));

            fs.writeFileSync(folderName + 'master.m3u8', fileContent.replace(selectedLine, selectedLine.replace('YES', 'NO')));

            if(!fileContent.includes(audioDir + "-cast")) {
              textToAppend.push(
                {
                  url: folderName + "master.m3u8",
                  text: selectedLine
                    .replace(audioDir, audioDir + "-cast").
                      replace(/NAME="[^"]*"/g, "NAME=\"cast" + (index + 1) + "\"").
                      replace(/CHANNELS="[^"]*"/g, "CHANNELS=\"2\"")
                    + "\n"
                });
            }

            if (endedStreams === audioDirectories.length) {

              for (const appendData of textToAppend) {
                fs.appendFileSync(
                  appendData.url, replacementLang(textToAppend.map(text => text.text), appendData.text)
                );
              }

              this.progressStatus.streamsStatus[streamIndex].prog = 100;
              this.websocketService.emit('processing-media', this.progressStatus);

              if(resetStatus) {
                this.progressStatus = null;
                this.websocketService.emit('processing-media', this.progressStatus);
              }
              resolve();
            }

            resolveFile();
          })
          .run();
        })
      }
    });
  }

  async generateThumbs(videoId: string) {
    this.progressStatus.mainMsg = 'Generating thumbnails';
    this.websocketService.emit('processing-media', this.progressStatus);

    const folderName = this.getInitialLocation() + '/' + videoId + '/';
    const resolution = 200;
    const fileData = await this.getFileData(folderName + this.masterFileName);

    const videoData = fileData.streams.filter(
      (stream) => stream.codec_type == 'video',
    )[0];
    const duration = fileData.format.duration;

    const fps = Math.round(eval(videoData.avg_frame_rate));
    const scaledWidth = Math.round(
      (videoData.width / videoData.height) * resolution,
    );

    const optimalSettings = getOptimalFrameInterval(
      duration,
      resolution,
      scaledWidth,
    );

    console.log(optimalSettings);

    const complexFilter =
      'select=' +
      "'not(mod(n," +
      fps * optimalSettings.frameInterval +
      "))'" +
      ',scale=' +
      scaledWidth +
      ':' +
      resolution +
      ',tile=' +
      optimalSettings.square +
      'x' +
      optimalSettings.square;

    return new Promise<void>((resolve, reject) => {
      ffmpeg(folderName + 'master.m3u8')
        .addOption([
          '-map 0:v:0',
          '-filter_complex ' + complexFilter,
          '-qscale:v 1',
          '-frames:v 1',
        ])
        .output(folderName + 'thumbs.jpg')
        .on('error', (err) => {
          return reject(err);
        })
        .on('end', () => {
          createVTT(
            duration,
            'thumbs.jpg',
            folderName + 'thumbnails.vtt',
            optimalSettings.frameInterval,
            scaledWidth,
            resolution,
            optimalSettings.square,
          );

          /*this.moviesService.updateOne(videoId, {
            $set: {
              'fileInfos.thumbnailsGenerated': true,
            },
          });*/

          resolve();
        })
        .run();
    });

    function getOptimalFrameInterval(
      duration: number,
      resolution: number,
      scaledWidth: number,
    ) {
      let frameInterval = 1;
      let square = Math.ceil(Math.sqrt(duration / frameInterval));

      while (
        (scaledWidth * square * 8 + 1024) * (resolution * square + 128) >=
        2047483647
      ) {
        frameInterval++;
        square = Math.ceil(Math.sqrt(duration / frameInterval));
      }

      return {
        frameInterval: frameInterval,
        square: square,
      };
    }

    function createVTT(
      duration: number,
      spriteFileLocation: string,
      outputVTTFileName: string,
      gapBetweenFrames: number,
      thumbnailWidth: number,
      thumbnailHeight: number,
      tileSize: number,
    ) {
      try {
        fs.unlinkSync(outputVTTFileName);
        console.log(outputVTTFileName + ' already exists - deleted it');
      } catch (err) {
        if (err && err.code === 'ENOENT') {
          console.log(outputVTTFileName + ' does not exist - will create it');
        }
      }

      const initialData = 'WEBVTT' + EOL + EOL;
      _appendFileSync(outputVTTFileName, initialData);

      const itemNumber = Math.floor(duration / gapBetweenFrames) + 1;
      let currentTime = 0;
      let xCoordinates = 0;
      let yCoordinates = 0;
      const thumbnailSizeString =
        ',' + thumbnailWidth + ',' + thumbnailHeight + EOL + EOL;

      for (let i = 0, len = itemNumber; i <= len; i++) {
        if (currentTime > duration) {
          break;
        }
        const startTime = _secondsToHRTime(currentTime);
        currentTime += gapBetweenFrames;
        const endTime = _secondsToHRTime(currentTime);
        if (!startTime || !endTime) {
          console.log(
            'Error: could not determine startTime or endTime for VTT item number ' +
              i +
              ' - exit',
          );
          return;
        }
        let string = startTime + ' --> ' + endTime + EOL;
        string +=
          spriteFileLocation + '#xywh=' + xCoordinates + ',' + yCoordinates;
        string += thumbnailSizeString;
        xCoordinates += thumbnailWidth;
        if (xCoordinates > thumbnailWidth * (tileSize - 1)) {
          yCoordinates += thumbnailHeight;
          xCoordinates = 0;
        }
        _appendFileSync(outputVTTFileName, string);
      }

      function _appendFileSync(file: string, data: string) {
        try {
          fs.appendFileSync(file, data);
        } catch (err) {
          if (err) throw err;
        }
      }

      function _secondsToHRTime(time: number) {
        if (typeof time === 'number' && time >= 0) {
          let seconds = Math.floor(time % 60);
          let minutes = Math.floor((time) / 60);
          let hours = 0;
          if (minutes > 59) {
            hours = Math.floor((time) / 3600);
            minutes = Math.floor((((time) / 3600) % 1) * 60);
            seconds = Math.floor(time % 60);
          }

          let Sseconds = '';
          let Sminutes = '';
          let Shours = '';

          if (seconds < 10) {
            Sseconds = '0' + seconds;
          }
          if (minutes < 10) {
            Sminutes = '0' + minutes;
          }
          if (hours > 0) {
            Shours = hours + ':';
          } else if (hours === 0) {
            Shours = '';
          }
          return Shours + Sminutes + ':' + Sseconds + '.000';
        } else {
          return '';
        }
      }
    }
  }
}
