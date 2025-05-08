import {BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {hash} from "bcryptjs";
import {Score} from "../../score/entities/score.entity";
import {IsBoolean, IsEmail, IsNotEmpty, IsString} from "class-validator";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @IsNotEmpty()
    @IsString()
    @Column({ name: 'first_name' })
    public firstName: string;

    @Column({ name: 'last_name' })
    public lastName: string;

    @IsEmail()
    @IsNotEmpty()
    @Column({ unique: true })
    public email: string;

    @IsString()
    @IsNotEmpty()
    @Column({ select: false })
    public password: string;

    @IsString()
    @Column()
    public username: string;

    @IsBoolean()
    @Column({ default: false })
    public is_admin: boolean;

    @OneToMany(() => Score, score => score.user, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    scores: Score[];

    @Column({ default: false })
    verified: boolean;

    @Column({ name: 'otp_code', nullable: true })
    otpCode: string;

    @Column({ name: 'otp_expires', nullable: true })
    otpExpires: Date;

    @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'deleted_at', nullable: true })
    deletedAt: Date;

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