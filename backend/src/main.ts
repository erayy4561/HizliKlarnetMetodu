import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORS configured for direct access. Note: In production with Nginx, 
  // API requests usually come via same-origin proxy (host), evading CORS issues.
  // This setting mainly helps local dev or separate frontend hosting.
  app.setGlobalPrefix('api');
  const allowedOrigins = process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:5173', 'http://localhost:3000'];
  
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Geçici olarak tüm origin'lere izin ver (production'da kısıtlayın)
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const port = process.env.PORT || 8080;
  await app.listen(port);
}
bootstrap();
