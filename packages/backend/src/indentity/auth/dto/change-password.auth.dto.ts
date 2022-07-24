import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class ChangePasswordAuthDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'exemple.test@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Change password token',
    example: 'b7wCwIHaRkhhCJW5IfZN8LzehT1SoE98Y4ZfmrCE8X9gj14TrWqBBdbhXzjm2vzb',
  })
  token: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({
    description: 'New user password',
    example: '12345612',
  })
  newPassword: string;

  @IsString()
  @IsOptional()
  @Length(6, 20)
  @ApiProperty({
    description: 'New user password confirmation',
    example: '123456',
  })
  newPasswordConfirm?: string;
}
