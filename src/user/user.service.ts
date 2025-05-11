import { Injectable } from '@nestjs/common';
import {User} from "./entities/user.entity";
import {IUserService} from "./user.interface";
import {IPaginationOptions} from "../utils/types/pagination-options.type";
import {EntityCondition} from "../utils/types/entity-condition.type";
import {DeepPartial, Repository} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class UserService implements IUserService {
    constructor(private readonly userRepository: Repository<User>) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email }
        });
        if(existingUser) {
            throw new Error("User already exists..");
        }
        const newUser = this.userRepository.create(createUserDto);
        return this.userRepository.save(newUser);
    }

    async deleteUser(id: User["id"]): Promise<void> {
        const existingUser = await this.userRepository.findOne({
            where: {id: id}
        });
        if (!existingUser) {
            throw new Error("User doesn't exist..");
        }
        await this.userRepository.softDelete(id);
    }

    findAllUsersWithPagination(options: IPaginationOptions): Promise<User[]> {
        return this.userRepository.find({
            skip: options.page * options.pageSize,
            take: options.pageSize
        });
    }

    findOneUser(options: EntityCondition<User>): Promise<User> {
        return this.userRepository.findOne({ where: options });
    }

    updateUser(id: User["id"], payload: DeepPartial<User>) {
    }
}
