import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
