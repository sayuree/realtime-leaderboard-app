import {Body, Controller, HttpCode, HttpStatus, Inject, Post} from "@nestjs/common";
import {LoginDto, VerifyDto} from "./dto/auth.dto";
import {User} from "../user/entities/user.entity";
import {RegisterDto} from "./dto/register.dto";
import {IAuthService} from "./auth.interface";
import {Services} from "../utils/constants";
import {RegisterResponseType} from "./types/register-response.type";

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(Services.AUTH) private readonly authService: IAuthService) {}

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseType> {
        const createdUser = await this.authService.register(registerDto);
        return {
            statusCode: 201,
            message: 'User is successfully registered',
            data: createdUser
        };
    }

    @Post('/verify')
    @HttpCode(HttpStatus.OK)
    async verify(@Body() verifyDto: VerifyDto): Promise<string> {
        return this.authService.verifyCode(verifyDto)
    }


    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        const data = await this.authService.login(loginDto);
        return {
            message: 'Login successful',
            data
        };
    }
}