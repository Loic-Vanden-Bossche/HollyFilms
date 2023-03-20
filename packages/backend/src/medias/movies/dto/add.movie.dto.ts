import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddMovieDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: "Movie id in tmdb",
    example: 13493,
  })
  tmdbId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "filePath of the movie",
    example: "/media/13493.mp4",
  })
  filePath: string;
}
