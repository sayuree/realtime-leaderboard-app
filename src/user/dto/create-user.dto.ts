import {IsBoolean, IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @MinLength(4)
    username?: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsBoolean()
    isAdmin?: boolean = false;

    @MinLength(6)
    otpCode: string;
}