# Render Web Service Kurulumu - Adım Adım

## 🎯 Web Service Oluşturma

Render'da yeni bir Web Service eklediniz. Şimdi GitHub repository'nizi bağlayın.

---

## 📝 Adım Adım: GitHub Bağlantısı

### 1. GitHub Repository Bağlama

Render'da Web Service oluştururken:

#### Seçenek 1: GitHub Repository Seçimi
- **"Connect account"** veya **"Connect GitHub"** butonuna tıklayın
- GitHub hesabınızı bağlayın (eğer daha önce bağlamadıysanız)
- Repository listesinden **`HizliKlarnetMetodu`** (veya repository adınızı) seçin

#### Seçenek 2: Repository URL ile
- Eğer repository görünmüyorsa, **"Public Git repository"** seçeneğini kullanın
- Repository URL'ini girin: `https://github.com/erayy4561/HizliKlarnetMetodu`

---

## ⚙️ Build ve Deploy Ayarları

### 2. Temel Ayarlar

#### Name (İsim)
- **Name**: `clarinet-lessons-backend`
- Veya istediğiniz bir isim

#### Region (Bölge)
- **Region**: Database ile **aynı bölgeyi** seçin
- Örnek: Database'i Frankfurt'ta oluşturduysanız, backend'i de Frankfurt'ta oluşturun

#### Branch (Dal)
- **Branch**: `main`
- Veya kodunuzun bulunduğu branch

#### Root Directory (Kök Dizin)
- **Root Directory**: `backend` ⚠️ **ÇOK ÖNEMLİ!**
- Bu, Render'a backend klasörünün nerede olduğunu söyler
- Eğer boş bırakırsanız, root dizinde arar ve hata verir

#### Runtime (Çalışma Ortamı)
- **Runtime**: `Node`
- Otomatik olarak seçilmiş olabilir

#### Build Command (Build Komutu)
- **Build Command**: `npm install && npm run build`
- Bu komut, paketleri yükler ve projeyi build eder

#### Start Command (Başlatma Komutu)
- **Start Command**: `npm run start:prod`
- Bu komut, production modunda uygulamayı başlatır

#### Plan (Plan)
- **Plan**: **Free** (ücretsiz)
- Veya **Starter** ($7/ay) - daha iyi performans için

---

## 🔐 Environment Variables (Ortam Değişkenleri)

### 3. Environment Variables Ekleme

**"Environment"** veya **"Environment Variables"** sekmesine gidin ve şu değişkenleri ekleyin:

#### Database Bağlantı Bilgileri

Database'den aldığınız bilgileri buraya ekleyin:

```
PORT=8080
DB_HOST=<database-host>
DB_PORT=5432
DB_USER=<database-user>
DB_PASSWORD=<database-password>
DB_NAME=clarinet_lessons
```

**Örnek:**
```
PORT=8080
DB_HOST=dpg-xxxxx-a.render.com
DB_PORT=5432
DB_USER=app
DB_PASSWORD=abc123xyz456
DB_NAME=clarinet_lessons
```

#### JWT ve Diğer Ayarlar

```
JWT_SECRET=<güçlü-bir-secret-key-min-32-karakter>
JWT_EXPIRATION=86400000
NODE_ENV=production
```

**Örnek:**
```
JWT_SECRET=my_super_secret_jwt_key_min_32_characters_long_12345
JWT_EXPIRATION=86400000
NODE_ENV=production
```

#### Database URL (Alternatif Yöntem)

Eğer Render "Internal Database URL" kullanmanızı öneriyorsa:

```
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Not:** Eğer `DATABASE_URL` kullanırsanız, backend kodunu buna göre güncellememiz gerekebilir. Şimdilik yukarıdaki ayrı değişkenleri kullanın.

---

## 📋 Environment Variables Listesi (Tam)

Tüm environment variables:

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

**Önemli:** `<...>` içindeki değerleri database'den aldığınız gerçek değerlerle değiştirin!

---

## 🚀 Deploy

### 4. "Create Web Service" Butonuna Tıklayın

Tüm ayarları yaptıktan sonra:
- **"Create Web Service"** butonuna tıklayın
- Deploy başlayacak (5-10 dakika sürebilir)

### 5. Deploy Sürecini Takip Edin

- **"Logs"** sekmesine gidin
- Deploy sürecini takip edin
- Build işlemi başarılı olmalı

---

## ✅ Deploy Başarılı Olduktan Sonra

### 6. Backend URL'ini Not Edin

Deploy tamamlandıktan sonra:
- Backend URL'i gösterilecek
- Örnek: `https://clarinet-lessons-backend.onrender.com`
- Bu URL'i not edin

### 7. Backend Test

Tarayıcıda şu URL'i açın:
```
https://clarinet-lessons-backend.onrender.com/api
```

**Beklenen:** Bir response görmelisiniz (JSON veya HTML)

---

## 🎨 Frontend Güncelleme

### 8. Vercel'de Environment Variable Güncelleme

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

## 🔍 Sorun Giderme

### Build Hatası

**Sorun:** Build başarısız oluyor

**Çözüm:**
1. **"Logs"** sekmesinde hata mesajlarını kontrol edin
2. **Root Directory** doğru mu? (`backend` olmalı)
3. **Build Command** doğru mu? (`npm install && npm run build`)
4. GitHub repository'de `backend` klasörü var mı?

### Database Bağlantı Hatası

**Sorun:** Database'e bağlanamıyor

**Çözüm:**
1. Environment variables doğru mu?
2. Database host, port, user, password doğru mu?
3. Database hazır mı? (Status: Available)
4. Database ve backend aynı region'da mı?

### Port Hatası

**Sorun:** Port hatası alıyorsunuz

**Çözüm:**
1. `PORT=8080` environment variable'ı eklediniz mi?
2. Backend kodunda `process.env.PORT || 8080` kullanılıyor mu? (Evet, kullanılıyor)

---

## 📝 Kontrol Listesi

Deploy öncesi kontrol:

- [ ] GitHub repository bağlandı
- [ ] Root Directory: `backend` ayarlandı
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm run start:prod`
- [ ] Environment variables eklendi (PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, JWT_EXPIRATION, NODE_ENV)
- [ ] Database bilgileri doğru
- [ ] Region database ile aynı

---

## ⏱️ Bekleme Süresi

- **Build süresi:** 5-10 dakika
- **İlk deploy:** Biraz daha uzun sürebilir

---

**GitHub'dan direkt çekin ve tüm ayarları yapın. Deploy başarılı olduğunda haber verin!** 🚀
