export class RegisterDto {
    email: string;
    username?: string;
    firstName: string;
    lastName: string;
    password: string;
}

export class VerifyDto {
    id: string;
    otpCode: string;
}

export class LoginDto {
    email: string;
    password: string;
}

