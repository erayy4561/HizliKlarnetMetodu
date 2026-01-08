import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Course } from './course.entity';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Get()
    findAll() {
        return this.coursesService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() course: Partial<Course>) {
        return this.coursesService.create(course);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.coursesService.delete(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-enrollments')
    getMyEnrollments(@Request() req) {
        return this.coursesService.getEnrollmentsByUser(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/enroll')
    enroll(@Param('id') id: string, @Request() req) {
        return this.coursesService.enroll(+id, req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/withdraw')
    withdraw(@Param('id') id: string, @Request() req) {
        return this.coursesService.withdraw(+id, req.user);
    }
}
