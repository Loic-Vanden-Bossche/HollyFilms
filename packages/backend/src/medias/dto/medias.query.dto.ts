import { IsEnum, IsNumberString, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { ListType } from "../medias.utils";

export class MediasQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  skip?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ListType)
  type?: ListType;
}
