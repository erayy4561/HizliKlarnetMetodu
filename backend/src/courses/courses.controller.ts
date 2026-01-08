import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Course } from './course.entity';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    /**
     * Tüm dersleri listeler.
     * @returns Course objeleri dizisi
     */
    @Get()
    findAll() {
        return this.coursesService.findAll();
    }

    /**
     * Yeni ders oluşturur.
     * @param course - Ders bilgilerini içeren obje (title, description vb.)
     * @returns Oluşturulan ders objesi
     */
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() course: Partial<Course>) {
        return this.coursesService.create(course);
    }

    /**
     * ID'si verilen dersi siler.
     * @param id - Silinecek dersin ID'si
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.coursesService.delete(+id);
    }

    /**
     * Kullanıcının kayıtlı olduğu dersleri listeler.
     * @param req - İstek yapan kullanıcı bilgisi (token'dan gelir)
     * @returns Kullanıcının kayıtlı olduğu dersler
     */
    @UseGuards(JwtAuthGuard)
    @Get('my-enrollments')
    getMyEnrollments(@Request() req) {
        return this.coursesService.getEnrollmentsByUser(req.user.userId);
    }

    /**
     * Kullanıcıyı bir derse kaydeder.
     * @param id - Ders ID'si
     * @param req - İstek yapan kullanıcı bilgisi (token'dan gelir)
     */
    @UseGuards(JwtAuthGuard)
    @Post(':id/enroll')
    enroll(@Param('id') id: string, @Request() req) {
        return this.coursesService.enroll(+id, req.user);
    }

    /**
     * Kullanıcının dersten kaydını siler.
     * @param id - Ders ID'si
     * @param req - İstek yapan kullanıcı bilgisi (token'dan gelir)
     */
    @UseGuards(JwtAuthGuard)
    @Post(':id/withdraw')
    withdraw(@Param('id') id: string, @Request() req) {
        return this.coursesService.withdraw(+id, req.user);
    }
}
