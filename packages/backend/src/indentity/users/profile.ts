import { Prop } from '@nestjs/mongoose';
import { PlayedMedia } from '../../medias/schemas/played-media.schema';
import { ApiProperty } from '@nestjs/swagger';

export class Profile {
  @ApiProperty({
    description: "Current profile's unique id",
    example: '5e9f8f8f8f8f8f8f8f8f8f8f8',
  })
  profileUniqueId: string;

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

  @Prop()
  username: string;

  @ApiProperty({
    description: 'Color profile color',
    example: '#ff0000',
  })
  color: string;

  @ApiProperty({
    description: 'Array of medias that the user has played',
  })
  playedMedias?: PlayedMedia[];
}
