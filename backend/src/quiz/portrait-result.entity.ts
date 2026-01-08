import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('portrait_result')
export class PortraitResult {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    duration: number; // minutes

    @Column({ name: 'correct_answers' })
    correctAnswers: number;

    @Column({ name: 'wrong_answers' })
    wrongAnswers: number;

    @Column({ name: 'score_percentage' })
    scorePercentage: number;

    @Column({ name: 'completion_time' })
    completionTime: number; // seconds

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
