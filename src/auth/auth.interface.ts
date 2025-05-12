import {RegisterDto} from "./dto/register.dto";
import {User} from "../user/entities/user.entity";
import {LoginDto} from "./dto/auth.dto";
import {LoginResponseType} from "./types/login-response.type";

export interface IAuthService {
    register(registerDto: RegisterDto): Promise<User>;
    login(loginDto: LoginDto): Promise<LoginResponseType>;
}