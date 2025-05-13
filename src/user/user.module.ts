import {Module} from "@nestjs/common";
import {UserService} from "./user.service";
import {UserController} from "./user.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Services} from "../utils/constants";


@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [{
        provide: Services.USER,
        useClass: UserService
    }],
    exports: [{
        provide: Services.USER,
        useClass: UserService
    }]
})

export class UserModule {}