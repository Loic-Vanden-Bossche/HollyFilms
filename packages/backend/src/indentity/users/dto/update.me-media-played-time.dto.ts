import {
  IsArray,
  IsEmail,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength, Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../shared/role';

export default class UpdateMeMediaPlayedTimeDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'Current play time of the movie or episode',
    example: 40,
  })
  currentTime: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'Season index of the movie or episode',
    example: 1,
  })
  seasonIndex: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'Episode index of the movie or episode',
    example: 1,
  })
  episodeIndex: number;
}
