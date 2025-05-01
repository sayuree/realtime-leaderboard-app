import {BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {hash} from "bcryptjs";
import {Score} from "../../score/entities/score.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ name: 'first_name' })
    public firstName: string;

    @Column({ name: 'last_name' })
    public lastName: string;

    @Column({ unique: true })
    public email: string;

    @Column()
    public password: string;

    @Column()
    public username: string;

    @Column()
    public is_admin: boolean;

    @OneToMany(() => Score, score => score.user)
    scores: Score[];

    @Column({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at' })
    updatedAt: Date;

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    @BeforeInsert()
    @BeforeUpdate()
    normalizeEmail() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (!this.password) {
            return;
        }
        this.password = await hash(this.password, 10);
    }
}