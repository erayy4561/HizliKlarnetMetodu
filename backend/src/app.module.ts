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
      type: process.env.DB_TYPE === 'postgres' ? 'postgres' : 'better-sqlite3',
      host: process.env.DB_TYPE === 'postgres' ? (process.env.DB_HOST || 'localhost') : undefined,
      port: process.env.DB_TYPE === 'postgres' ? parseInt(process.env.DB_PORT || '5432') : undefined,
      username: process.env.DB_TYPE === 'postgres' ? (process.env.DB_USER || 'app') : undefined,
      password: process.env.DB_TYPE === 'postgres' ? (process.env.DB_PASSWORD || 'app_password') : undefined,
      database: process.env.DB_TYPE === 'postgres' ? (process.env.DB_NAME || 'clarinet_lessons') : 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: process.env.NODE_ENV === 'production' && process.env.DB_TYPE === 'postgres' ? { rejectUnauthorized: false } : false,
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
