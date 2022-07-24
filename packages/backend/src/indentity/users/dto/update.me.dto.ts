import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateMeDto {
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

  @IsString()
  @IsOptional()
  @Length(6, 20)
  @ApiProperty({
    description: 'New user password',
    example: '123456',
  })
  newPassword?: string;

  @IsString()
  @IsOptional()
  @Length(6, 20)
  @ApiProperty({
    description: 'New user password confirmation',
    example: '123456',
  })
  newPasswordConfirm?: string;
}
