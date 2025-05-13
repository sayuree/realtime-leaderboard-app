import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule} from "@nestjs/config";
import {UserService} from "../user/user.service";
import {Services} from "../utils/constants";


@Module({
    imports: [UserModule,  JwtModule.register({}), ConfigModule.forRoot()],
    controllers: [AuthController],
    providers: [{
        provide: Services.AUTH,
        useClass: AuthService
    }],
    exports: [{
        provide: Services.AUTH,
        useClass: AuthService
    }]
})

export class AuthModule {}