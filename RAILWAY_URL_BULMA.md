# Railway'de Backend URL'ini Bulma Kılavuzu

## 🚀 Adım Adım: Railway URL'ini Bulma

### 1. Railway Dashboard'a Giriş Yapın

1. [railway.app](https://railway.app) adresine gidin
2. GitHub hesabınızla giriş yapın

### 2. Projenizi Bulun

1. Ana sayfada deploy ettiğiniz projeyi bulun
2. Proje kartına tıklayın

### 3. Service'i Seçin

1. Proje içinde "Services" bölümünde backend service'inizi bulun
2. Service kartına tıklayın

### 4. URL'i Bulun

Railway'de URL'i bulmanın **3 yolu** var:

#### Yöntem 1: Settings'ten (En Kolay)

1. Service sayfasında üst menüden **"Settings"** sekmesine tıklayın
2. Aşağı kaydırın, **"Networking"** veya **"Domains"** bölümünü bulun
3. **"Generate Domain"** veya **"Custom Domain"** bölümünde URL'inizi göreceksiniz
4. URL şu formatta olacak: `your-service-name.up.railway.app`

#### Yöntem 2: Deployments'tan

1. Service sayfasında **"Deployments"** sekmesine tıklayın
2. En son deployment'ı bulun (yeşil tick işareti olan)
3. Deployment'a tıklayın
4. **"View Logs"** veya deployment detaylarında URL gösterilir

#### Yöntem 3: Variables'tan

1. Service sayfasında **"Variables"** sekmesine tıklayın
2. `RAILWAY_PUBLIC_DOMAIN` veya benzeri bir variable varsa, orada URL olabilir

---

## 🔧 URL Oluşturma (Eğer Yoksa)

Eğer URL görünmüyorsa:

### 1. Public Domain Oluşturun

1. Service sayfasında **"Settings"** → **"Networking"** bölümüne gidin
2. **"Generate Domain"** butonuna tıklayın
3. Railway otomatik olarak bir domain oluşturacak
4. Domain şu formatta olacak: `your-service-name.up.railway.app`

### 2. Custom Domain (Opsiyonel)

1. Kendi domain'inizi eklemek isterseniz:
   - **"Custom Domain"** bölümüne gidin
   - Domain'inizi ekleyin
   - DNS ayarlarını yapın

---

## 📝 URL Formatı

Railway URL'leri genellikle şu formattadır:

```
https://your-service-name.up.railway.app
```

**Örnek:**
```
https://clarinet-backend.up.railway.app
```

---

## ⚠️ Önemli Notlar

### Port Numarası

Railway otomatik olarak port atar. Backend'inizde port'u environment variable'dan almalısınız:

```typescript
// backend/src/main.ts
const port = process.env.PORT || 8080;
```

### HTTPS

Railway otomatik olarak HTTPS sağlar. URL'iniz `https://` ile başlar.

### Environment Variable Olarak Port

Railway otomatik olarak `PORT` environment variable'ını set eder. Backend'inizde:

```typescript
const port = process.env.PORT || 8080;
await app.listen(port);
```

---

## 🔗 Vercel'e URL Ekleme

Railway URL'inizi aldıktan sonra:

1. **Vercel Dashboard'a gidin**
2. Projenize tıklayın
3. **Settings** → **Environment Variables**
4. Yeni variable ekleyin:
   ```
   Name: VITE_API_URL
   Value: https://your-railway-url.up.railway.app/api
   ```
   ⚠️ **Dikkat**: `/api` eklemeyin, frontend zaten ekliyor!

5. **Redeploy yapın**

---

## 🐛 Sorun Giderme

### URL Görünmüyor

- Service'in deploy edildiğinden emin olun
- "Settings" → "Networking" bölümünü kontrol edin
- "Generate Domain" butonuna tıklayın

### URL Çalışmıyor

- Service'in çalıştığından emin olun (yeşil durum)
- Logları kontrol edin: "Deployments" → "View Logs"
- Port'un doğru ayarlandığından emin olun

### CORS Hatası

Backend'de CORS ayarlarını güncelleyin:

```typescript
// backend/src/main.ts
app.enableCors({
  origin: [
    'https://your-vercel-app.vercel.app',
    'https://your-railway-url.up.railway.app',
    'http://localhost:5173'
  ],
  credentials: true
})
```

---

## 📸 Görsel Rehber

Railway'de URL'i bulmak için:

1. **Ana Sayfa** → Projenize tıklayın
2. **Service** → Backend service'inize tıklayın  
3. **Settings** → **Networking** → Domain'i görün
4. URL'i kopyalayın: `https://your-service.up.railway.app`

---

## ✅ Checklist

- [ ] Railway'a giriş yapıldı
- [ ] Proje bulundu
- [ ] Service seçildi
- [ ] Settings → Networking'e gidildi
- [ ] Domain oluşturuldu (gerekirse)
- [ ] URL kopyalandı
- [ ] Vercel'e `VITE_API_URL` eklendi
- [ ] Frontend yeniden deploy edildi

---

**Başarılar! 🎉**
