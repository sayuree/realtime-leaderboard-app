import {IsBoolean, IsInt, IsString, Max, Min} from "class-validator";
import {registerAs} from "@nestjs/config";
import {MailerConfig} from "./config.type";
import {validateConfig} from "../utils/validateConfig";
import * as process from "process";

export class EnvironmentVariables {
    @IsString()
    MAILER_HOST

    @IsInt()
    @Min(0)
    @Max(65535)
    MAILER_PORT

    @IsBoolean()
    MAILER_SECURE

    @IsString()
    MAILER_AUTH_USER

    @IsString()
    MAILER_AUTH_PASSWORD

    @IsString()
    MAILER_DEFAULT_NAME

    @IsString()
    MAILER_DEFAULT_MAIL
}

export default registerAs<MailerConfig>('mailer', () => {
    validateConfig(process.env, EnvironmentVariables);

    return {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        secure: process.env.MAILER_SECURE,
        user: process.env.MAILER_AUTH_USER,
        password: process.env.MAILER_AUTH_PASSWORD,
        fromName: process.env.MAILER_DEFAULT_NAME,
        fromMail: process.env.MAILER_DEFAULT_MAIL
    }
});