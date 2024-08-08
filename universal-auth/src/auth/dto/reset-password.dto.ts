import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    email: string;
}