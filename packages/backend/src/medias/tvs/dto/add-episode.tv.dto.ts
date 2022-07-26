import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddEpisodeTvDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Path of the media to add',
    example: '/media/test/test.mp4',
  })
  filePath: string;
}
