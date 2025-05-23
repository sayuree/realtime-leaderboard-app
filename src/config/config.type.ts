export type AuthConfig = {
    secret?: string;
    expiresIn?: string;
    refreshSecret?: string;
    refreshExpiresIn?: string;
}

export type OtpConfig = {
    otpExpiryMinutes?: string;
}

export type MailerConfig = {
    host?: string;
    port: number;
    secure: boolean;
    user?: string;
    password?: string;
    fromName?: string;
    fromEmail?: string;
}

export type AllConfig = {
    auth: AuthConfig;
    otp: OtpConfig;
    mailer: MailerConfig;
}