import { PlayedMedia } from '../../medias/schemas/played-media.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Media } from '../../medias/media.schema';
import { TMDBMicroSearchResult } from '../../tmdb/tmdb.models';

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
  playedMedias?: PlayedMedia[];

  @ApiProperty({
    description: 'Array of medias that the user has requested to an admin',
  })
  addRequestedMedias?: TMDBMicroSearchResult[];

  @ApiProperty({
    description: 'Array of medias that the user added to his list',
  })
  mediasInList?: Media[];

  @ApiProperty({
    description: 'Array of medias that the user liked',
  })
  likedMedias?: Media[];
}
