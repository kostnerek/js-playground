import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class VerifyAccountDto {
    @IsString()
    @IsMongoId()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}