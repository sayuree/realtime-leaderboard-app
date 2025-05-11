import {MinLength} from "class-validator";

export class RegisterDto {
    email: string;
    username?: string;
    firstName: string;
    lastName: string;
    @MinLength(6)
    password: string;
}