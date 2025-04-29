import {Controller, Post} from "@nestjs/common";
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    async signUp() {
        await this.authService.signUp();
        return 'User signed up successfully!'
    }

    @Post('/verify')
    verify() {

    }

    @Post('/login')
    signIn() {

    }

    @Post('logout')
    signOut() {

    }
}