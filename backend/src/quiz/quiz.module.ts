import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortraitResult } from './portrait-result.entity';
import { PerformanceResult } from './performance-result.entity';
import { PortraitResultController } from './portrait-result.controller';
import { PerformanceResultController } from './performance-result.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PortraitResult, PerformanceResult])],
    controllers: [PortraitResultController, PerformanceResultController],
})
export class QuizModule { }
