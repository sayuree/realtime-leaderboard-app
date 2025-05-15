import {IsString} from "class-validator";
import {registerAs} from "@nestjs/config";
import {OtpConfig} from "./config.type";
import {validateConfig} from "../utils/validateConfig";
import * as process from "process";

class EnvironmentalVariable {
    @IsString()
    OTP_EXPIRY_MINUTES: string;
}

export default registerAs<OtpConfig>('otp', () => {
    validateConfig(process.env, EnvironmentalVariable);

    return {
        otpExpiryMinutes: process.env.OTP_EXPIRY_MINUTES
    }
})