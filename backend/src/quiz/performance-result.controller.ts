import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformanceResult } from './performance-result.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';

@Controller('quiz/performance')
export class PerformanceResultController {
    constructor(
        @InjectRepository(PerformanceResult)
        private resultRepo: Repository<PerformanceResult>,
    ) { }

    /**
     * Yeni bir performans quiz sonucu kaydeder.
     * @param req - Kullanıcı bilgisi (userId)
     * @param body - Quiz sonuç verileri (doğruluk oranı, süre vb.)
     */
    @UseGuards(JwtAuthGuard)
    @Post('results')
    async saveResult(@Request() req, @Body() body: any) {
        const result = this.resultRepo.create({
            ...body,
            user: { id: Number(req.user.userId) } as User
        });
        const saved = await this.resultRepo.save(result);
        return saved;
    }

    /**
     * Giriş yapan kullanıcının geçmiş performans quiz sonuçlarını listeler.
     */
    @UseGuards(JwtAuthGuard)
    @Get('results/me')
    async getMyResults(@Request() req) {
        return this.resultRepo.find({
            where: { user: { id: req.user.userId } },
            order: { createdAt: 'DESC' }
        });
    }
}
