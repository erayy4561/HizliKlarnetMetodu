import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORS configured for direct access. Note: In production with Nginx, 
  // API requests usually come via same-origin proxy (host), evading CORS issues.
  // This setting mainly helps local dev or separate frontend hosting.
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5173',
      ...(process.env.FRONTEND_URL ? [] : ['*']), // Production'da tüm origin'lere izin ver (güvenlik için daha sonra kısıtlayın)
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const port = process.env.PORT || 8080;
  await app.listen(port);
}
bootstrap();
