import {CreateUserDto} from "./dto/create-user.dto";
import {User} from "./entities/user.entity";
import {EntityCondition} from "../utils/types/entity-condition.type";
import {DeepPartial} from "typeorm";
import {IPaginationOptions} from "../utils/types/pagination-options.type";
import {NullableType} from "../utils/types/nullable.type";

export interface IUserService {
    createUser(createUserDto: CreateUserDto): Promise<User>;
    findOneUser(options: EntityCondition<User>): Promise<NullableType<User>>;
    findAllUsersWithPagination(options: IPaginationOptions): Promise<User[]>;
    updateUser(id: User['id'], payload: DeepPartial<User>);
    deleteUser(id: User['id']);
}