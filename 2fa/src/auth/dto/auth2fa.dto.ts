import { IsEmail, IsString } from 'class-validator';

export class Auth2faDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  token: string;
}
