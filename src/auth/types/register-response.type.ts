import {User} from "../../user/entities/user.entity";

export type RegisterResponseType = Readonly<{
    statusCode: number,
    message: string;
    data: Partial<User>
}>