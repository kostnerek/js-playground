import { IsEmail } from 'class-validator';

export class PwdLessLoginDto {
  @IsEmail()
  destination: string;
}
