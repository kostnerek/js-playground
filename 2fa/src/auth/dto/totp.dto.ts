import { IsString } from 'class-validator';

export class TotpDto {
  @IsString()
  token: string;
}
