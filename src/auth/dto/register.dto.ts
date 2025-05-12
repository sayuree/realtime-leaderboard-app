import {IsEmail, IsNotEmpty, MinLength} from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @MinLength(4)
    username?: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @MinLength(6)
    password: string;
}