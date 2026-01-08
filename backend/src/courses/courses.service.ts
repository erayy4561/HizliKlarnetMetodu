import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
    ) { }

    findAll(): Promise<Course[]> {
        return this.coursesRepository.find();
    }

    create(course: Partial<Course>): Promise<Course> {
        return this.coursesRepository.save(course);
    }

    async delete(id: number): Promise<void> {
        await this.coursesRepository.delete(id);
    }

    async enroll(courseId: number, user: User): Promise<void> {
        const course = await this.coursesRepository.findOne({
            where: { id: courseId },
            relations: ['students']
        });
        if (course) {
            if (!course.students) course.students = [];
            // Check if already enrolled
            if (!course.students.find(s => s.id === user.id)) {
                course.students.push(user);
                await this.coursesRepository.save(course);
            }
        }
    }

    async withdraw(courseId: number, user: User): Promise<void> {
        const course = await this.coursesRepository.findOne({
            where: { id: courseId },
            relations: ['students']
        });
        if (course && course.students) {
            course.students = course.students.filter(s => s.id !== user.id);
            await this.coursesRepository.save(course);
        }
    }
}
