import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORS configured for direct access. Note: In production with Nginx, 
  // API requests usually come via same-origin proxy (host), evading CORS issues.
  // This setting mainly helps local dev or separate frontend hosting.
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true, // Tüm origin'lere izin ver (production'da kısıtlayın)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  const port = process.env.PORT || 8080;
  await app.listen(port);
}
bootstrap();
