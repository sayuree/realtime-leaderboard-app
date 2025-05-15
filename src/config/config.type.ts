export type AuthConfig = {
    secret?: string;
    expiresIn?: string;
    refreshSecret?: string;
    refreshExpiresIn?: string;
}

export type OtpConfig = {
    otpExpiryMinutes?: string;
}