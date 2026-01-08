import { Controller, Get, Param, Post, Delete, Body, UseGuards, NotFoundException, BadRequestException, Request, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { PortraitResult } from '../quiz/portrait-result.entity';
import { PerformanceResult } from '../quiz/performance-result.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as bcrypt from 'bcrypt';

@Controller('admin')
@UseGuards(JwtAuthGuard) // Add Roles Guard here for ADMIN/SUPERADMIN in real app
export class AdminController {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(PortraitResult) private portraitRepo: Repository<PortraitResult>,
        @InjectRepository(PerformanceResult) private performanceRepo: Repository<PerformanceResult>,
    ) { }

    /**
     * Tüm kullanıcıları listeler.
     * @returns User listesi
     */
    @Get('users')
    findAll() {
        return this.userRepo.find();
    }

    /**
     * Belirli bir kullanıcının detaylarını getirir.
     * @param id - Kullanıcı ID'si
     */
    @Get('users/:id')
    async findOne(@Param('id') id: string) {
        const user = await this.userRepo.findOne({ where: { id: +id } });
        if (!user) throw new NotFoundException();
        return user;
    }

    /**
     * Kullanıcının şifresini değiştirir (Admin işlemi).
     * @param id - Kullanıcı ID'si
     * @param body - { password } içeren obje
     */
    @Post('users/:id/password')
    async changePassword(@Param('id') id: string, @Body() body: { password: string }) {
        if (!body.password || body.password.length < 6) throw new BadRequestException('invalid_password');
        const user = await this.userRepo.findOne({ where: { id: +id } });
        if (!user) throw new NotFoundException();

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(body.password, salt);
        await this.userRepo.save(user);
        return { status: 'ok' };
    }

    /**
     * Kullanıcının portre quiz sonuçlarını getirir.
     * @param id - Kullanıcı ID'si
     */
    @Get('users/:id/results/portrait')
    async getPortraitResults(@Param('id') id: string) {
        return this.portraitRepo.find({
            where: { user: { id: +id } },
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Kullanıcının performans quiz sonuçlarını getirir.
     * @param id - Kullanıcı ID'si
     */
    @Get('users/:id/results/performance')
    async getPerformanceResults(@Param('id') id: string) {
        return this.performanceRepo.find({
            where: { user: { id: +id } },
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Kullanıcıyı siler. Sadece SUPERADMIN yetkisiyle çalışır.
     * @param id - Silinecek kullanıcı ID'si
     */
    @Delete('users/:id')
    async deleteUser(@Param('id') id: string, @Request() req) {
        const roles = req.user.roles || [];
        if (!roles.includes('SUPERADMIN') && req.user.accountType !== 'SUPERADMIN') {
            throw new ForbiddenException('Only superadmins can delete users');
        }

        const userToDelete = await this.userRepo.findOne({ where: { id: +id } });
        if (!userToDelete) throw new NotFoundException('User not found');

        if (userToDelete.id === req.user.userId) {
            throw new BadRequestException('Cannot delete yourself');
        }

        await this.userRepo.remove(userToDelete);
        return { status: 'deleted', id };
    }
}
