import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../../shared/role";

export default class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: "User email",
    example: "exemple.test@gmail.com",
  })
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(32)
  @ApiProperty({
    description: "User first name",
    example: "John",
  })
  firstname?: string;

  @IsString()
  @IsOptional()
  @MaxLength(32)
  @ApiProperty({
    description: "User last name",
    example: "Doe",
  })
  lastname?: string;

  @IsString()
  @IsOptional()
  @MaxLength(32)
  @ApiProperty({
    description: "User nickname",
    example: "Johnny",
  })
  username?: string;

  @IsString()
  @IsOptional()
  @Length(6, 20)
  @ApiProperty({
    description: "User password",
    example: "123456",
  })
  password?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: "User roles",
    enum: Role,
    isArray: true,
    example: [Role.User, Role.Admin],
  })
  roles: Role[];
}
