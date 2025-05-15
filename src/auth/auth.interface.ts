import {RegisterDto} from "./dto/register.dto";
import {User} from "../user/entities/user.entity";
import {LoginDto, VerifyDto} from "./dto/auth.dto";
import {LoginResponseType} from "./types/login-response.type";
import {RegisterResponseType} from "./types/register-response.type";

export interface IAuthService {
    register(registerDto: RegisterDto): Promise<Partial<User>>;
    login(loginDto: LoginDto): Promise<LoginResponseType>;
    verifyCode(verifyDto: VerifyDto): Promise<string>;
}