import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class GetPlayerStatusDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Id of the played media',
    example: '98167639264982',
  })
  mediaId: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    description: 'Season index of the movie or episode',
    example: '0',
  })
  si: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    description: 'Episode index of the movie or episode',
    example: '0',
  })
  ei: string;
}
