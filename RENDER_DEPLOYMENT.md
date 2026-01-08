# Render Deployment Kılavuzu

## 🚀 Render Nedir?

Render, Railway'e benzer bir platform-as-a-service (PaaS) çözümüdür. Ücretsiz tier sunar ve kolay kullanımıyla öne çıkar.

**Avantajları:**
- ✅ Ücretsiz tier (sınırlı kaynaklarla)
- ✅ Kolay kurulum
- ✅ Otomatik HTTPS
- ✅ GitHub entegrasyonu
- ✅ Environment variables yönetimi
- ✅ MySQL database desteği

---

## 📋 Gereksinimler

1. **Render hesabı**: https://render.com → Sign Up (GitHub ile giriş yapabilirsiniz)
2. **GitHub repository**: Kodunuz GitHub'da olmalı
3. **MySQL database**: Render'da MySQL servisi oluşturulacak

---

## 🗄️ Adım 1: MySQL Database Oluşturma

### 1.1. Render Dashboard'a Gidin

1. https://render.com → Login
2. **"New +"** butonuna tıklayın
3. **"PostgreSQL"** veya **"MySQL"** seçin (MySQL varsa MySQL'i seçin)

**Not:** Render'da ücretsiz MySQL yoksa, **PostgreSQL** kullanabilirsiniz. Backend kodunu PostgreSQL'e uyarlamamız gerekir.

### 1.2. Database Ayarları

- **Name**: `clarinet-lessons-db`
- **Database**: `clarinet_lessons`
- **User**: `app` (otomatik oluşturulur)
- **Region**: En yakın bölgeyi seçin
- **Plan**: **Free** (veya **Starter** - $7/ay)

### 1.3. Database Bilgilerini Not Edin

Database oluşturulduktan sonra:
- **Internal Database URL**: `mysql://user:password@host:port/database`
- **External Database URL**: (varsa)
- **Host**: `xxxxx.render.com`
- **Port**: `3306` (veya farklı)
- **Database**: `clarinet_lessons`
- **User**: `app`
- **Password**: (Render'da gösterilir)

---

## 🔧 Adım 2: Backend Deployment

### 2.1. Yeni Web Service Oluşturma

1. Render Dashboard → **"New +"** → **"Web Service"**
2. GitHub repository'nizi bağlayın:
   - **"Connect account"** → GitHub hesabınızı bağlayın
   - Repository'nizi seçin: `HizliKlarnetMetodu`

### 2.2. Build Ayarları

- **Name**: `clarinet-lessons-backend`
- **Region**: Database ile aynı bölgeyi seçin
- **Branch**: `main`
- **Root Directory**: `backend` (önemli!)
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Plan**: **Free** (veya **Starter** - $7/ay)

### 2.3. Environment Variables

**"Environment"** sekmesine gidin ve şu değişkenleri ekleyin:

```
PORT=8080
DB_HOST=<database-host>
DB_PORT=3306
DB_USER=<database-user>
DB_PASSWORD=<database-password>
DB_NAME=clarinet_lessons
JWT_SECRET=<güçlü-bir-secret-key-min-32-karakter>
JWT_EXPIRATION=86400000
NODE_ENV=production
```

**Örnek:**
```
PORT=8080
DB_HOST=dpg-xxxxx-a.render.com
DB_PORT=3306
DB_USER=app
DB_PASSWORD=abc123xyz
DB_NAME=clarinet_lessons
JWT_SECRET=my_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRATION=86400000
NODE_ENV=production
```

**Not:** Database bilgilerini Render Dashboard'dan alın.

### 2.4. Deploy

1. **"Create Web Service"** butonuna tıklayın
2. Deploy başlayacak (5-10 dakika sürebilir)
3. **"Logs"** sekmesinden deploy sürecini takip edin

### 2.5. Backend URL'ini Not Edin

Deploy tamamlandıktan sonra:
- **URL**: `https://clarinet-lessons-backend.onrender.com` (veya benzeri)
- Bu URL'i not edin, frontend'de kullanacağız

---

## 🎨 Adım 3: Frontend Deployment (Vercel'de Kalabilir)

Frontend zaten Vercel'de deploy edilmiş. Sadece environment variable'ı güncellemeniz gerekiyor:

### 3.1. Vercel Environment Variable Güncelleme

1. Vercel Dashboard → Projenize gidin
2. **"Settings"** → **"Environment Variables"**
3. **`VITE_API_URL`** değişkenini bulun veya oluşturun
4. Değeri güncelleyin:
   ```
   https://clarinet-lessons-backend.onrender.com/api
   ```
   (Render'dan aldığınız backend URL'i + `/api`)

5. **"Redeploy"** yapın

---

## ✅ Adım 4: Test

### 4.1. Backend Test

Tarayıcıda şu URL'i açın:
```
https://clarinet-lessons-backend.onrender.com/api
```

**Beklenen:** Bir response görmelisiniz

### 4.2. Frontend Test

1. Frontend'de login sayfasını açın
2. Giriş yapmayı deneyin
3. F12 → Network sekmesi → OPTIONS ve POST request'lerini kontrol edin

---

## 🔍 Sorun Giderme

### Backend Çalışmıyor

1. **Logları Kontrol:**
   - Render Dashboard → Backend service → **"Logs"**
   - Hata mesajlarını kontrol edin

2. **Environment Variables:**
   - Tüm değişkenler doğru mu?
   - Database bağlantı bilgileri doğru mu?

3. **Build Hatası:**
   - **"Logs"** sekmesinde build hatalarını kontrol edin
   - `npm install` başarılı mı?
   - `npm run build` başarılı mı?

### Database Bağlantı Hatası

1. **Internal vs External URL:**
   - Render'da aynı servis içindeyse **Internal URL** kullanın
   - Farklı servislerdeyse **External URL** kullanın

2. **Database Host:**
   - Render'da database'in **"Connections"** sekmesinden host'u kontrol edin

### CORS Hatası

Backend'de CORS ayarları zaten yapılmış. Eğer hala sorun varsa:

1. Render Dashboard → Backend service → **"Environment"**
2. Şunu ekleyin:
   ```
   FRONTEND_URL=https://hizli-klarnet-metodu.vercel.app
   ```

---

## 💰 Ücretsiz Tier Limitleri

**Render Free Tier:**
- 750 saat/ay (yaklaşık 31 gün)
- 15 dakika idle sonrası uyku modu (ilk request yavaş olabilir)
- 512 MB RAM
- 0.1 CPU

**Öneri:** Production için **Starter** plan ($7/ay) daha iyi performans sağlar.

---

## 📝 Özet

1. ✅ Render'da MySQL database oluşturun
2. ✅ Backend'i Render'a deploy edin
3. ✅ Environment variables'ı ayarlayın
4. ✅ Frontend'de `VITE_API_URL`'i güncelleyin
5. ✅ Test edin

**Render genellikle Railway'den daha stabil çalışır ve CORS sorunları daha az görülür!**
