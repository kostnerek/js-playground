import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @IsMongoId()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}