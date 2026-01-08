# Render PostgreSQL Deployment (MySQL Yerine)

## 🗄️ Neden PostgreSQL?

Render'da ücretsiz tier'da **MySQL yok**, sadece **PostgreSQL** var. Backend kodunu PostgreSQL'e uyarlamamız gerekiyor.

---

## 🔧 Adım 1: Backend Kodunu Güncelleme

### 1.1. app.module.ts Güncelle

`backend/src/app.module.ts` dosyasını şu şekilde güncelleyin:

```typescript
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
      type: 'postgres', // 'mysql' yerine 'postgres'
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'), // 3306 yerine 5432
      username: process.env.DB_USER || 'app',
      password: process.env.DB_PASSWORD || 'app_password',
      database: process.env.DB_NAME || 'clarinet_lessons',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // SSL için
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
```

### 1.2. package.json Kontrol

`backend/package.json` dosyasında `pg` paketi olmalı:

```json
{
  "dependencies": {
    "pg": "^8.11.0",
    "@types/pg": "^8.10.0"
  }
}
```

Eğer yoksa:
```bash
cd backend
npm install pg @types/pg
```

---

## 🗄️ Adım 2: Render'da PostgreSQL Database Oluşturma

### 2.1. Render Dashboard

1. https://render.com → Login
2. **"New +"** → **"PostgreSQL"**

### 2.2. Database Ayarları

- **Name**: `clarinet-lessons-db`
- **Database**: `clarinet_lessons`
- **User**: `app` (otomatik)
- **Region**: En yakın bölge
- **Plan**: **Free** (veya **Starter** - $7/ay)

### 2.3. Database Bilgilerini Not Edin

Database oluşturulduktan sonra:
- **Internal Database URL**: `postgresql://user:password@host:port/database`
- **Host**: `xxxxx.render.com`
- **Port**: `5432`
- **Database**: `clarinet_lessons`
- **User**: `app`
- **Password**: (Render'da gösterilir)

---

## 🔧 Adım 3: Backend Deployment

### 3.1. Yeni Web Service

1. Render Dashboard → **"New +"** → **"Web Service"**
2. GitHub repository'nizi bağlayın

### 3.2. Build Ayarları

- **Name**: `clarinet-lessons-backend`
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`

### 3.3. Environment Variables

```
PORT=8080
DB_HOST=<database-host>
DB_PORT=5432
DB_USER=<database-user>
DB_PASSWORD=<database-password>
DB_NAME=clarinet_lessons
JWT_SECRET=<güçlü-bir-secret-key-min-32-karakter>
JWT_EXPIRATION=86400000
NODE_ENV=production
```

**Önemli:** `DB_PORT=5432` (MySQL'in 3306'sı yerine PostgreSQL'in 5432'si)

### 3.4. Deploy

**"Create Web Service"** butonuna tıklayın ve deploy'u bekleyin.

---

## ✅ Test

Backend test:
```
https://clarinet-lessons-backend.onrender.com/api
```

---

## 📝 Özet

1. ✅ Backend kodunu PostgreSQL'e uyarlayın (`type: 'postgres'`, `port: 5432`)
2. ✅ `pg` paketini yükleyin
3. ✅ Render'da PostgreSQL database oluşturun
4. ✅ Backend'i deploy edin
5. ✅ Environment variables'ı ayarlayın (`DB_PORT=5432`)

**PostgreSQL, MySQL'e çok benzer ve genellikle sorunsuz çalışır!**
