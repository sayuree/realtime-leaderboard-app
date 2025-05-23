import {Module} from "@nestjs/common";
import {Services} from "../utils/constants";
import {MailerService} from "./mailer.service";


@Module({
    providers: [{
        provide: Services.MAILER,
        useClass: MailerService
    }],
    exports: [{
        provide: Services.MAILER,
        useClass: MailerService
    }]
})
