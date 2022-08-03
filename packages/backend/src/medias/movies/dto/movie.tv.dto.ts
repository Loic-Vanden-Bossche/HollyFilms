import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MovieTvDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Movie id in tmdb',
    example: 13493,
  })
  tmdbId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'filePath of the movie',
    example: '/media/13493.mp4',
  })
  filePath: string;
}
