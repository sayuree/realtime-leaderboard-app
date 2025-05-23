import {MailDataType} from "./types/mail-data.type";

export interface IMailService {
    confirmRegistration(
        mailData: MailDataType<{ otpCode: string; user: string }>
    ): Promise<void>;

    forgotPassword(
        mailData: MailDataType<{ otpCode: string; user: string }>
    ): Promise<void>;
}