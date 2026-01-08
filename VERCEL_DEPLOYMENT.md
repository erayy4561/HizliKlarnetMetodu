# Vercel Deployment Kılavuzu

Bu kılavuz, Clarinet Lessons projesini Vercel'e deploy etmek için adımları içermektedir.

## Önemli Notlar

⚠️ **Backend için**: Vercel serverless functions NestJS için ideal değildir. Backend'i ayrı bir servise (Railway, Render, Heroku) deploy etmeniz önerilir.

## Seçenek 1: Sadece Frontend'i Vercel'e Deploy Etme (Önerilen)

### Adımlar:

1. **GitHub Repository'yi Hazırlayın**
   ```bash
   git add .
   git commit -m "Vercel deployment hazırlığı"
   git push origin main
   ```

2. **Vercel'e Giriş Yapın**
   - [Vercel](https://vercel.com) adresine gidin
   - GitHub hesabınızla giriş yapın

3. **Yeni Proje Oluşturun**
   - "Add New Project" butonuna tıklayın
   - GitHub repository'nizi seçin
   - **Root Directory**: `frontend` olarak ayarlayın
   - **Framework Preset**: Vite seçin
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables Ekleyin**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
   (Backend URL'inizi buraya yazın)

5. **Deploy Edin**
   - "Deploy" butonuna tıklayın
   - Deployment tamamlandıktan sonra URL'inizi alın

### Frontend API URL'ini Güncelleme

`frontend/src/utils/api.ts` dosyasını güncelleyin:

```typescript
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})
```

## Seçenek 2: Backend'i Railway/Render'a Deploy Etme

### Railway ile Backend Deployment:

1. [Railway](https://railway.app) adresine gidin
2. "New Project" → "Deploy from GitHub repo" seçin
3. Backend klasörünü seçin
4. Environment variables ekleyin:
   ```
   DB_HOST=your-db-host
   DB_PORT=3306
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=clarinet_lessons
   JWT_SECRET=your-secret-key-min-32-chars
   JWT_EXPIRATION=86400000
   ```
5. Deploy edin ve URL'i alın

### Render ile Backend Deployment:

1. [Render](https://render.com) adresine gidin
2. "New Web Service" seçin
3. GitHub repository'nizi bağlayın
4. Ayarlar:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
5. Environment variables ekleyin
6. Deploy edin

## Seçenek 3: Full Stack Vercel Deployment (Gelişmiş)

Backend'i Vercel serverless functions olarak deploy etmek için:

1. `api/` klasörü oluşturun
2. NestJS'i serverless function'a dönüştürün (karmaşık)
3. Veya backend'i ayrı deploy edin (önerilen)

## CORS Ayarları

Backend'de CORS ayarlarını güncelleyin:

```typescript
// backend/src/main.ts
app.enableCors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
})
```

## Environment Variables

### Frontend (Vercel):
- `VITE_API_URL`: Backend API URL'i

### Backend (Railway/Render):
- `DB_HOST`: Veritabanı host
- `DB_PORT`: Veritabanı port
- `DB_USER`: Veritabanı kullanıcı adı
- `DB_PASSWORD`: Veritabanı şifresi
- `DB_NAME`: Veritabanı adı
- `JWT_SECRET`: JWT secret key (min 32 karakter)
- `JWT_EXPIRATION`: Token geçerlilik süresi (ms)

## Sorun Giderme

### Build Hatası
- `npm install` komutunu çalıştırın
- Node.js versiyonunu kontrol edin (18.x önerilir)

### API Bağlantı Hatası
- Backend URL'inin doğru olduğundan emin olun
- CORS ayarlarını kontrol edin
- Environment variables'ın doğru ayarlandığından emin olun

## Önerilen Deployment Stratejisi

1. **Frontend**: Vercel (ücretsiz, hızlı, kolay)
2. **Backend**: Railway veya Render (ücretsiz tier mevcut)
3. **Database**: Railway PostgreSQL veya Render PostgreSQL (ücretsiz tier)

Bu şekilde tüm stack'i ücretsiz olarak deploy edebilirsiniz!
