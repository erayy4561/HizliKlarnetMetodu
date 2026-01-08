import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { User } from '../users/user.entity';
import { PortraitResult } from '../quiz/portrait-result.entity';
import { PerformanceResult } from '../quiz/performance-result.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, PortraitResult, PerformanceResult])],
    controllers: [AdminController],
})
export class AdminModule { }
