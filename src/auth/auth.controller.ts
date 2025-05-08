import {Body, Controller, HttpCode, HttpStatus, Post} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {LoginDto, RegisterDto, VerifyDto} from "./dto/auth.dto";
import {User} from "../user/entities/user.entity";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() registerDto: RegisterDto): Promise<User> {
        const createdUser = await this.authService.register(registerDto);
        return createdUser;
    }

    @Post('/verify')
    @HttpCode(HttpStatus.OK)
    async verify(@Body() verifyDto: VerifyDto): Promise<string> {
        return this.authService.verifyCode(verifyDto)
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto) {
        const data = await this.authService.login(loginDto);
        return {
            message: 'Login successful',
            data
        };
    }
}