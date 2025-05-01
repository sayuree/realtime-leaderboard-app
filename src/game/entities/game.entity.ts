import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Score} from "../../score/entities/score.entity";

@Entity('games')
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ name: 'min_score' })
    minScore: number;

    @Column({ name: 'max_score' })
    maxScore: number;

    @Column({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Score, score => score.game)
    scores: Score[];
}