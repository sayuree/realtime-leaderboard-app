import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from '../../user/entities/user.entity';
import {Game} from "../../game/entities/game.entity";

@Entity('scores')
export class Score {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    value: number;

    @Column({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(
        _ => User,
        user => user.id,
        { cascade: true }
    )
    user_id: User;

    @ManyToOne(
        () => User,
        user => user.scores, // Reference to the scores property in User entity
        { onDelete: 'CASCADE' } // Optional: cascade behavior
    )
    @JoinColumn({ name: 'user_id' }) // Explicitly define the column name
    user: User;

    @ManyToOne(
        () => Game,
        game => game.scores, // Reference to the scores property in User entity
        { onDelete: 'CASCADE' } // Optional: cascade behavior
    )
    @JoinColumn({ name: 'game_id' }) // Explicitly define the column name
    game: Game;
}