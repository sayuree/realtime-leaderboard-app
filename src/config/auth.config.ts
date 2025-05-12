import {IsString} from "class-validator";
import {registerAs} from "@nestjs/config";
import {AuthConfig} from "./config.type";
import * as process from "process";
import {validateConfig} from "../utils/validateConfig";

class EnvironmentalVariable {
    @IsString()
    AUTH_JWT_SECRET: string;

    @IsString()
    AUTH_JWT_TOKEN_EXPIRES_IN: string;

    @IsString()
    AUTH_REFRESH_SECRET: string;

    @IsString()
    AUTH_REFRESH_TOKEN_EXPIRES_IN: string;
}

export default registerAs<AuthConfig>('auth', () => {
    validateConfig(process.env, EnvironmentalVariable);

    return {
        secret: process.env.AUTH_JWT_SECRET,
        expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
        refreshSecret: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
        refreshExpiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN
    };
})