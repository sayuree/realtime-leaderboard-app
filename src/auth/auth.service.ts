import {Body, Injectable} from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import {LoginDto, RegisterDto, VerifyDto} from "./dto/auth.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import * as crypto from "crypto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async register(@Body() registerDto: RegisterDto): Promise<User> {
        const [email, password] = registerDto;

        const existingUser = await this.userRepository.findOne({
            where: {
                email: email,
            }
        });

        if(existingUser) {
            throw new Error(`User exists with email: ${email}`);
        }
        const otpCode = this.generateOTP();
        const user = this.userRepository.create({...registerDto, otpCode: otpCode });
        return await this.userRepository.save(user);
    }

    async verifyCode(@Body() verifyDto: VerifyDto) {
        const [id, otpCode] = verifyDto;
        const user = await this.userRepository.findOne({
            where: { id: id }
        });

        if(this.verifyOTP(user, otpCode)) {
            return 'User is verified';
        }
        return 'Verification is failed. Please retry';
    }

    async login(@Body() loginDto: LoginDto) {
        const [email, password] = loginDto;
        const existingUser = await this.userRepository.findOne({
            where: {
                email: email
            },
             select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                username: true
             }
        });

        if(!existingUser) {
            throw new Error(`User is not registered`);
        }
        const payload = { id: existingUser.id };
        const accessToken = this.jwtService.sign(payload);

        return { existingUser, accessToken: accessToken }
    }



    async logout() {

    }

    generateOTP(): string {
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let otpCode = '';
        for(let i = 0; i < 6; i++) {
            otpCode += numbers[crypto.randomInt(numbers.length)];
        }
        return otpCode
    }

    verifyOTP(user: User | null, verifyCode: string): boolean {
        if(!user || !user.otpCode || !user.otpExpires || user.otpExpires < new Date()) {
            throw new Error('OTP code is not generated or expired');
        }

        if(user.otpCode !== verifyCode) {
            return false;
        }
        return true;
    }
}