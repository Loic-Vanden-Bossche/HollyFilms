import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ListType {
  ALL = '',
  POPULAR = 'popular',
  RECENT = 'recent',
  INLIST = 'inlist',
  LIKED = 'liked',
  WATCHED = 'watched',
  CONTINUED = 'continue',
}

export class MediasQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  skip?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ListType)
  type?: ListType;
}
