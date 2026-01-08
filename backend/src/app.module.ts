import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { QuizModule } from './quiz/quiz.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'app',
      password: process.env.DB_PASSWORD || 'app_password',
      database: process.env.DB_NAME || 'clarinet_lessons',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Enable auto-sync for development
    }),
    AuthModule,
    UsersModule,
    CoursesModule,
    QuizModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
