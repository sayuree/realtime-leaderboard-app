import {Injectable} from "@nestjs/common";
import {JwtService} from '@nestjs/jwt';
import {LoginDto, VerifyDto} from "./dto/auth.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import * as crypto from "crypto";
import {IAuthService} from "./auth.interface";
import {IUserService} from "../user/user.interface";
import {RegisterDto} from "./dto/register.dto";
import {LoginResponseType} from "./types/login-response.type";
import {TokenPayloadType} from "./types/token-payload.type";
import {ConfigService} from "@nestjs/config";
import ms from "ms";
import {TokenResponseType} from "./types/token-response.type";
import {compareHash} from "../utils/hash-helpers";

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @InjectRepository(User)
        private readonly userService: IUserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async register(registerDto: RegisterDto): Promise<User> {
        const otpCode = this.generateOTP();
        return await this.userService.createUser({...registerDto, otpCode });
    }

    async verifyCode(verifyDto: VerifyDto) {
        const [id, otpCode] = verifyDto;
        const user = await this.userService.findOneUser({ id });

        if(this.verifyOTP(user, otpCode)) {
            return 'User is verified';
        }
        return 'Verification is failed. Please retry';
    }

    async login(loginDto: LoginDto): Promise<LoginResponseType> {
        const [email, password] = loginDto;
        const existingUser = await this.userService.findOneUser({ email });
        const isValidPassword = await compareHash(password, existingUser.password);

        if(!isValidPassword) {
            throw new Error('Passwords dont match..');
        }

        const payload = { id: existingUser.id };
        const tokenData = await this.generateTokens(payload);

        return { user: existingUser, ...tokenData};
    }



    async logout() {

    }

    private generateOTP(): string {
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let otpCode = '';
        for(let i = 0; i < 6; i++) {
            otpCode += numbers[crypto.randomInt(numbers.length)];
        }
        return otpCode
    }

    private async generateTokens(payload: TokenPayloadType): Promise<TokenResponseType> {
        const accessTokenExpiresIn
            = this.configService.getOrThrow<string>('auth.expiresIn');
        // const accessTokenExpires = Date.now() + ms(accessTokenExpiresIn);

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow<string>('auth.secret'),
                expiresIn: accessTokenExpiresIn
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow<string>('auth.refreshSecret'),
                expiresIn: this.configService.getOrThrow<string>('auth.refreshExpiresIn')
            })
        ]);

        return {
            accessToken,
            expiresIn: accessTokenExpiresIn,
            refreshToken
        }
    }

    private verifyOTP(user: User | null, verifyCode: string): boolean {
        if(!user || !user.otpCode || !user.otpExpires || user.otpExpires < new Date()) {
            throw new Error('OTP code is not generated or expired');
        }

        if(user.otpCode !== verifyCode) {
            return false;
        }
        return true;
    }
}