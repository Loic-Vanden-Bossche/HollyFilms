import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class RegisterAuthDto {
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
  @MaxLength(32)
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastname: string;

  @IsString()
  @IsOptional()
  @MaxLength(32)
  @ApiProperty({
    description: 'User nickname',
    example: 'Johnny',
  })
  username?: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  password: string;

  @IsString()
  @IsOptional()
  @Length(6, 20)
  @ApiProperty({
    description: 'User password confirmation',
    example: '123456',
  })
  passwordConfirm?: string;
}
