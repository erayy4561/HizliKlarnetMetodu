# Login Sorunu Giderme Kılavuzu

## 🔍 Sorun Tespiti

Login yapamıyorsanız, aşağıdaki adımları kontrol edin:

---

## ✅ Adım 1: Browser Console Kontrolü

1. **Tarayıcıda F12 tuşuna basın**
2. **Console** sekmesine gidin
3. **Network** sekmesine gidin
4. **Login butonuna tıklayın**
5. **Hangi hataları görüyorsunuz?**

### Olası Hatalar:

#### ❌ CORS Hatası
```
Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS policy
```
**Çözüm**: Backend CORS ayarlarını güncelleyin (Adım 2)

#### ❌ 404 Not Found
```
POST https://your-backend-url.com/api/auth/login 404 (Not Found)
```
**Çözüm**: Backend URL'i yanlış (Adım 3)

#### ❌ Network Error
```
Network Error
```
**Çözüm**: Backend çalışmıyor veya URL yanlış (Adım 4)

#### ❌ 401 Unauthorized
```
401 (Unauthorized)
```
**Çözüm**: Kullanıcı adı/şifre yanlış veya backend'de sorun var

---

## ✅ Adım 2: Backend CORS Ayarlarını Güncelleme

Backend'inizde CORS ayarlarını güncelleyin:

### Railway'de Backend Kodunu Güncelleme

1. **Local'de backend/src/main.ts dosyasını açın**

2. **CORS ayarlarını güncelleyin:**

```typescript
// backend/src/main.ts
app.enableCors({
  origin: [
    'https://your-vercel-app.vercel.app',  // Vercel frontend URL'iniz
    'http://localhost:5173',                // Local development
    'http://localhost:3000',                // Alternatif local port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

3. **Değişiklikleri commit edin ve push edin:**

```bash
git add backend/src/main.ts
git commit -m "Update CORS settings for Vercel"
git push origin main
```

4. **Railway otomatik olarak yeniden deploy edecek**

---

## ✅ Adım 3: Vercel Environment Variable Kontrolü

1. **Vercel Dashboard'a gidin**
2. **Projenize tıklayın**
3. **Settings** → **Environment Variables**
4. **`VITE_API_URL` variable'ını kontrol edin:**

### Doğru Format:
```
VITE_API_URL=https://your-backend.up.railway.app
```

### Yanlış Formatlar:
```
❌ VITE_API_URL=https://your-backend.up.railway.app/api  (YANLIŞ - /api eklemeyin!)
❌ VITE_API_URL=http://your-backend.up.railway.app      (YANLIŞ - https kullanın!)
❌ VITE_API_URL=your-backend.up.railway.app             (YANLIŞ - https:// ekleyin!)
```

5. **Eğer yanlışsa, düzeltin ve Redeploy yapın**

---

## ✅ Adım 4: Backend'in Çalıştığını Kontrol Etme

### Railway'de Kontrol:

1. **Railway Dashboard'a gidin**
2. **Service'inize tıklayın**
3. **"Deployments" sekmesine gidin**
4. **En son deployment'ın yeşil (başarılı) olduğundan emin olun**
5. **"View Logs" butonuna tıklayın**
6. **Loglarda şunu arayın:**
   ```
   Application is running on: http://0.0.0.0:8080
   ```
   veya
   ```
   Nest application successfully started
   ```

### Manuel Test:

1. **Backend URL'inizi tarayıcıda açın:**
   ```
   https://your-backend.up.railway.app/api
   ```
2. **Eğer bir response görüyorsanız, backend çalışıyor demektir**

---

## ✅ Adım 5: API URL'inin Doğru Olduğunu Kontrol Etme

### Frontend'de Kontrol:

1. **Tarayıcıda F12 → Network sekmesi**
2. **Login butonuna tıklayın**
3. **İstek URL'ini kontrol edin:**

**Doğru URL:**
```
https://your-backend.up.railway.app/api/auth/login
```

**Yanlış URL'ler:**
```
❌ https://your-backend.up.railway.app/auth/login        (YANLIŞ - /api eksik)
❌ https://your-backend.up.railway.app/api/api/auth/login (YANLIŞ - /api iki kez)
❌ http://localhost:8080/api/auth/login                 (YANLIŞ - Local URL)
```

---

## ✅ Adım 6: Backend Loglarını Kontrol Etme

### Railway'de:

1. **Service sayfasında "View Logs" butonuna tıklayın**
2. **Login denemesi yapın**
3. **Loglarda şunları arayın:**
   - `POST /api/auth/login` isteği geliyor mu?
   - Hata mesajları var mı?
   - Database bağlantısı çalışıyor mu?

---

## ✅ Adım 7: Database Bağlantısını Kontrol Etme

Railway'de database kullanıyorsanız:

1. **Railway'de PostgreSQL service'i oluşturun** (eğer yoksa)
2. **Backend service'inize bağlayın**
3. **Environment variables ekleyin:**
   ```
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your-password
   DB_NAME=railway
   ```
4. **Backend'i yeniden deploy edin**

---

## 🎯 Hızlı Kontrol Listesi

- [ ] Browser console'da hata var mı? (F12)
- [ ] Network tab'ında istek gönderiliyor mu?
- [ ] Backend URL doğru mu? (`https://your-backend.up.railway.app`)
- [ ] Vercel'de `VITE_API_URL` doğru mu? (`https://your-backend.up.railway.app` - `/api` YOK)
- [ ] Backend CORS ayarları güncel mi? (Vercel URL'i ekli mi?)
- [ ] Backend çalışıyor mu? (Railway logs kontrol)
- [ ] Database bağlantısı var mı? (Railway'de PostgreSQL service)

---

## 🔧 Hemen Yapılacaklar

1. **Browser console'u açın (F12)**
2. **Hangi hatayı görüyorsunuz? Bana söyleyin:**
   - CORS hatası mı?
   - 404 hatası mı?
   - Network error mı?
   - Başka bir hata mı?

3. **Network tab'ında login isteğini kontrol edin:**
   - İstek gönderiliyor mu?
   - Hangi URL'e gidiyor?
   - Response ne döndürüyor?

Bu bilgileri paylaşırsanız, daha spesifik çözüm sunabilirim!
