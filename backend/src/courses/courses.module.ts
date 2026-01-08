import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './course.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, User])], // Need User for enroll? Maybe just Course is enough if using relation save cascade
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService]
})
export class CoursesModule { }
