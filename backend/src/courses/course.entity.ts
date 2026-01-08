import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('course')
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({ name: 'image_url' })
    imageUrl: string;

    @Column()
    level: string;

    @ManyToMany(() => User, (user) => user.courses)
    students: User[];
}
