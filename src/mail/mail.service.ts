import {Inject, Injectable} from "@nestjs/common";
import {Services} from "../utils/constants";
import {ConfigService} from "@nestjs/config";
import {AllConfig} from "../config/config.type";
import {IMailerService} from "../mailer/mailer.interface";
import {IMailService} from "./mail.interface";
import {MailDataType} from "./types/mail-data.type";
import * as path from "path";
import * as process from "process";

@Injectable()
export class MailService implements IMailService {
    constructor(
        @Inject(Services.MAILER) private readonly mailerService: IMailerService,
    ) {}

    async confirmRegistration(mailData: MailDataType<{ otpCode: string; user: string }>
    ): Promise<void> {
        await this.mailerService.sendMail({
            to: mailData.to,
            subject: 'Email Confirmation',
            text: `Your OTP is: ${mailData.data.otpCode}\n\nThis code expires in 15 minutes.`,
            templatePath: path.join(
                process.cwd(),
                'src',
                'mailer',
                'templates',
                'confirm-registration-otp.hbs',
            ),
            context: {
                username: mailData.data.user,
                otpCode: mailData.data.otpCode
            }
        })
    }

    async forgotPassword(mailData: MailDataType<{ otpCode: string; user: string }>
    ): Promise<void> {
        await this.mailerService.sendMail({
            to: mailData.to,
            subject: 'Password Reset',
            text: `Your OTP is: ${mailData.data.otpCode}\n\nThis code expires in 15 minutes.`,
            templatePath: path.join(
                process.cwd(),
                'src',
                'mailer',
                'templates',
                'reset-password-otp.hbs',
            ),
            context: {
                username: mailData.data.user,
                otpCode: mailData.data.otpCode
            }
        });
    }
}