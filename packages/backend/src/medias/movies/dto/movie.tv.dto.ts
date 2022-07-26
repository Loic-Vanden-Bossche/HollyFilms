import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MovieTvDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Movie id in tmdb',
    example: 13493,
  })
  tmdbId: number;
}
