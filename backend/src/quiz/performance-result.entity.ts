import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('performance_result')
export class PerformanceResult {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    duration: number;

    @Column({ name: 'notes_completed' })
    notesCompleted: number;

    @Column({ name: 'accuracy_percentage' })
    accuracyPercentage: number;

    @Column({ name: 'time_taken' })
    timeTaken: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
