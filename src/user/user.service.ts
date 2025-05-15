import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {User} from "./entities/user.entity";
import {IUserService} from "./user.interface";
import {IPaginationOptions} from "../utils/types/pagination-options.type";
import {EntityCondition} from "../utils/types/entity-condition.type";
import {DeepPartial, Repository} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import {NullableType} from "../utils/types/nullable.type";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class UserService implements IUserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email }
        });
        if(existingUser) {
            throw new HttpException("User already exists", HttpStatus.CONFLICT);
        }
        const newUser = this.userRepository.create(createUserDto);
        return this.userRepository.save(newUser);
    }

    async deleteUser(id: User["id"]): Promise<void> {
        const existingUser = await this.userRepository.findOne({
            where: {id: id}
        });
        if (!existingUser) {
            throw new NotFoundException(`User with id: ${id} doesn't exist`);
        }
        await this.userRepository.softDelete(id);
    }

    findAllUsersWithPagination(options: IPaginationOptions): Promise<User[]> {
        const page = options.page ?? 1;
        const pageSize = options.pageSize ?? 10;
        return this.userRepository.find({
            skip: page * pageSize,
            take: pageSize
        });
    }

    findOneUser(options: EntityCondition<User>): Promise<NullableType<User>> {
        return this.userRepository.findOne({ where: options });
    }

    updateUser(id: User["id"], payload: DeepPartial<User>) {
    }
}
