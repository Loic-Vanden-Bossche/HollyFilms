import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(32)
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstname?: string;

  @IsString()
  @IsOptional()
  @MaxLength(32)
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastname?: string;

  @IsString()
  @IsOptional()
  @MaxLength(32)
  @ApiProperty({
    description: 'User nickname',
    example: 'Johnny',
  })
  username?: string;
}
