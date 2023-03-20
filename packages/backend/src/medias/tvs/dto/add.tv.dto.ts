import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddTvDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: "TV id in tmdb",
    example: 13493,
  })
  tmdbId: number;
}
