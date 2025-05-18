import {ConflictException, GoneException, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from '@nestjs/jwt';
import {LoginDto, VerifyDto} from "./dto/auth.dto";
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
import {Services} from "../utils/constants";
import * as crypto from "crypto";

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @Inject(Services.USER) private readonly userService: IUserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async register(registerDto: RegisterDto): Promise<Partial<User>> {
        const otpCode = this.generateOTP();
        const otpExpiryMinutes
            = this.configService.getOrThrow<string>('otp.otpExpiryMinutes');
        const otpExpires = new Date(
            Date.now() + Number(otpExpiryMinutes) * 60 * 1000
        );
        const newUser
            = await this.userService.createUser({...registerDto, otpCode, otpExpires });
        return {
            id: newUser.id,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    }

    async verifyCode(verifyDto: VerifyDto): Promise<void> {
        const {id, otpCode} = verifyDto;
        const user = await this.userService.findOneUser({ id });

        if(user?.verified) {
            throw new ConflictException('User is already verified');
        }

        this.verifyOTP(user, otpCode);
        await this.userService.updateUser(id, { verified: true });
    }

    async login(loginDto: LoginDto): Promise<LoginResponseType> {
        const {email, password} = loginDto;
        const existingUser = await this.userService.findOneUser({ email });
        const isValidPassword = await compareHash(password, existingUser!.password);

        if(!isValidPassword) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { id: existingUser!.id };
        const tokenData = await this.generateTokens(payload);

        return { user: existingUser!, ...tokenData};
    }



    async logout() {
        //TODO: finish logout service
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
        const accessTokenExpires = Date.now() + ms(accessTokenExpiresIn);

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow<string>('auth.secret'),
                expiresIn: accessTokenExpires
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

    private verifyOTP(user: User | null, verifyCode: string): void {
        if(!user?.otpCode) {
            throw new GoneException('No OTP exists for this user');
        }
        if(!user.otpExpires || user.otpExpires < new Date()) {
            throw new GoneException('OTP has expired. Please request a new one');
        }

        if(user.otpCode !== verifyCode) {
            throw new UnauthorizedException('Invalid OTP code');
        }
    }

    forgotPassword(email: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    refreshToken(): Promise<void> {
        return Promise.resolve(undefined);
    }

    resetPassword(): Promise<void> {
        return Promise.resolve(undefined);
    }
}