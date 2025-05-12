import {Body, Controller, HttpCode, HttpStatus, Post} from "@nestjs/common";
import {LoginDto, VerifyDto} from "./dto/auth.dto";
import {User} from "../user/entities/user.entity";
import {RegisterDto} from "./dto/register.dto";
import {IAuthService} from "./auth.interface";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: IAuthService) {}

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDto): Promise<User> {
        const createdUser = await this.authService.register(registerDto);
        return createdUser;
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