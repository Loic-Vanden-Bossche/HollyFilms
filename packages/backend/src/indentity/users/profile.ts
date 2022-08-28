import { ApiProperty } from '@nestjs/swagger';
import { UserTMDBRecord } from './user-tmdb-record.schema';
import { PlayedMedia } from '../../medias/schemas/played-media.schema';
import { UserMediaRecord } from './user-media-record.schema';

export class CurrentMediaRecord {
  constructor(mediaRecord: UserMediaRecord) {
    this.mediaId = (mediaRecord.media as unknown as string).toString();
    this.createdAt = mediaRecord.createdAt;
  }

  @ApiProperty({
    description: 'Id of the media recorded',
    example: '5e9f8f8f8f8f8f8f8f8f8f8f8',
  })
  mediaId: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2020-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}

export class CurrentPlayedMedia {
  constructor(playedMedia: PlayedMedia) {
    this.mediaId = (playedMedia.media as unknown as string).toString();
    this.currentTime = playedMedia.currentTime;
    this.seasonIndex = playedMedia.seasonIndex;
    this.episodeIndex = playedMedia.episodeIndex;
    this.audioTrack = playedMedia.audioTrack;
    this.subtitleTrack = playedMedia.subtitleTrack;
    this.createdAt = playedMedia.createdAt;
    this.updatedAt = playedMedia.updatedAt;
  }

  @ApiProperty({
    description: 'Id of the played media',
    example: '5e9f8f8f8f8f8f8f8f8f8f8f8',
  })
  mediaId: string;

  @ApiProperty({
    description: 'Time played by the user in seconds',
    example: 120,
  })
  currentTime: number;

  @ApiProperty({
    description: 'Index of the season played',
    example: 1,
  })
  seasonIndex?: number;

  @ApiProperty({
    description: 'Index of the episode played',
    example: 1,
  })
  episodeIndex?: number;

  @ApiProperty({
    description: 'Index of the audio track played',
    example: 1,
  })
  audioTrack?: number;

  @ApiProperty({
    description: 'Index of the subtitle played',
    example: 1,
  })
  subtitleTrack?: number;

  @ApiProperty({
    description: 'Creation date of the played media',
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated date of the played media',
    example: new Date(),
  })
  updatedAt: Date;
}

export class Profile {
  @ApiProperty({
    description: "Current profile's unique id",
    example: '5e9f8f8f8f8f8f8f8f8f8f8f8',
  })
  profileUniqueId: string;

  @ApiProperty({
    description: 'Is the profile the default one',
    example: false,
  })
  isDefault: boolean;

  @ApiProperty({
    description: "The user's first name",
    example: 'John',
  })
  firstname: string;

  @ApiProperty({
    description: "The user's last name",
    example: 'Doe',
  })
  lastname: string;

  @ApiProperty({
    description: "The user's username",
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Profile picture url',
    example: 'profile/wxcdkjhqzu',
  })
  picture: string | null;

  @ApiProperty({
    description: 'Color profile color',
    example: '#ff0000',
  })
  color: string;

  @ApiProperty({
    description: 'Array of medias that the user has played',
  })
  playedMedias?: CurrentPlayedMedia[];

  @ApiProperty({
    description: 'Array of medias that the user has requested to an admin',
  })
  addRequestedMedias?: UserTMDBRecord[];

  @ApiProperty({
    description: 'Array of medias that the user added to his list',
  })
  mediasInList?: CurrentMediaRecord[];

  @ApiProperty({
    description: 'Array of medias that the user liked',
  })
  likedMedias?: CurrentMediaRecord[];
}
