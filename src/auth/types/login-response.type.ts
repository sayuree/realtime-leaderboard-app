import {User} from "../../user/entities/user.entity";

export type LoginResponseType = Readonly<{
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
    user: User;
}>