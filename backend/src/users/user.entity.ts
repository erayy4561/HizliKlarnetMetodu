import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Course } from '../courses/course.entity';

export enum AccountType {
    STANDARD = 'STANDARD',
    ADMIN = 'ADMIN',
    SUPERADMIN = 'SUPERADMIN',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password?: string;

    @Column({
        type: 'varchar',
        length: 20,
        default: AccountType.STANDARD,
        name: 'account_type' // Map to snake_case
    })
    accountType: AccountType;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToMany(() => Course, (course) => course.students, { cascade: true })
    @JoinTable({
        name: 'user_courses', // Legacy naming convention guess, usually users_courses or user_courses. User side.
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'course_id', referencedColumnName: 'id' }
    })
    courses: Course[];
}
