import {Module} from "@nestjs/common";
import {Services} from "../utils/constants";
import {MailService} from "./mail.service";

@Module({
    providers: [{
        provide: Services.MAILER,
        useClass: MailService
    }],
    exports: [{
        provide: Services.MAILER,
        useClass: MailService
    }]
})