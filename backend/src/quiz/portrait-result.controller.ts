import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortraitResult } from './portrait-result.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';

@Controller('quiz/portrait')
export class PortraitResultController {
    constructor(
        @InjectRepository(PortraitResult)
        private resultRepo: Repository<PortraitResult>,
    ) { }

    /**
     * Yeni bir portre quiz sonucu kaydeder.
     * @param req - Kullanıcı bilgisi (userId)
     * @param body - Quiz sonuç verileri (skor, doğru/yanlış vb.)
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
     * Giriş yapan kullanıcının geçmiş portre quiz sonuçlarını listeler.
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
