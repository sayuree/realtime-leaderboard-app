import {IMailerService} from "./mailer.interface";
import nodemailer from "nodemailer";
import {ConfigService} from "@nestjs/config";
import {AllConfig} from "../config/config.type";
import {MailOptionsType} from "./types/mail-options.type";
import { promises as fs } from 'fs';
import handlebars from 'handlebars';
import {Injectable} from "@nestjs/common";

@Injectable()
export class MailerService implements IMailerService {
    private transporter: nodemailer.Transporter;
    constructor(private readonly configService: ConfigService<AllConfig>) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('mailer.host', { infer: true }),
            port: this.configService.get<number>('mailer.port', { infer: true }),
            secure: this.configService.get<boolean>('mailer.secure', { infer: true }),
            auth: {
                user: this.configService.get<string>('mailer.user', { infer: true }),
                pass: this.configService.get<string>('mailer.password', { infer: true }),
            },
        });
    }

    async sendMail({ templatePath, context, ...mailOptions}: nodemailer.SendMailOptions &
        { templatePath: string; context: Record<string, unknown>; }): Promise<void> {
        let html: string | undefined;

        if(templatePath) {
            const template = await fs.readFile(templatePath, 'utf-8');
            html = handlebars.compile(template, { strict: true})(context);
        }
        const fromName = this.configService.get<string>('mailer.fromName');
        const fromMail = this.configService.get<string>('mailer.fromEmail');
        return await this.transporter.sendMail({
            ...mailOptions,
            from: mailOptions.from
                ? mailOptions.from
                : `${fromName} ${fromMail}`,
            html: html,
        });
    }
}