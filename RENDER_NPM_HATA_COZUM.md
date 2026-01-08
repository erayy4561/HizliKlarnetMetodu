# Render NPM Hatası Çözüm Kılavuzu

## 🐛 Hata: npm error

Render'da build sırasında npm hatası alıyorsunuz.

---

## 🔍 Adım 1: Render Loglarını Kontrol Edin

1. **Render Dashboard** → Backend service'inize gidin
2. **"Logs"** sekmesine tıklayın
3. **Tam hata mesajını** kopyalayın
4. Hata mesajında şunları arayın:
   - `npm ERR!`
   - `error:`
   - `failed`

---

## ✅ Yaygın Çözümler

### Çözüm 1: Node.js Versiyonu Kontrolü

Render'da Node.js versiyonu belirtilmemiş olabilir.

**Yapılacaklar:**
1. Render Dashboard → Backend service → **"Settings"** → **"Build & Deploy"**
2. **"Node Version"** alanını kontrol edin
3. **"18"** veya **"20"** yazın (veya boş bırakın, Render otomatik algılar)

**Alternatif:** `backend/package.json` dosyasına ekleyin:
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

---

### Çözüm 2: Build Command Kontrolü

Build command doğru mu kontrol edin.

**Render Dashboard → Backend service → "Settings" → "Build & Deploy":**

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm run start:prod
```

**Root Directory:**
```
backend
```

---

### Çözüm 3: package.json Script'leri Kontrolü

`backend/package.json` dosyasında şu script'ler olmalı:

```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main"
  }
}
```

Eğer yoksa, ekleyin.

---

### Çözüm 4: PostgreSQL Paketi Kontrolü

PostgreSQL paketi (`pg`) yüklü mü kontrol edin.

**Yapılacaklar:**
1. `backend/package.json` dosyasını açın
2. `dependencies` bölümünde `pg` var mı kontrol edin:

```json
{
  "dependencies": {
    "pg": "^8.11.0"
  }
}
```

Eğer yoksa, ekleyin:
```bash
cd backend
npm install pg
```

---

### Çözüm 5: TypeScript Build Hatası

TypeScript derleme hatası olabilir.

**Yapılacaklar:**
1. Lokal olarak test edin:
   ```bash
   cd backend
   npm install
   npm run build
   ```

2. Eğer lokal olarak da hata alıyorsanız, TypeScript hatalarını düzeltin.

3. `backend/tsconfig.json` dosyasını kontrol edin.

---

### Çözüm 6: Environment Variables Eksik

Bazı environment variables eksik olabilir.

**Render Dashboard → Backend service → "Environment" sekmesi:**

Şu değişkenlerin **hepsi** olmalı:
```
PORT=8080
DB_HOST=<database-host>
DB_PORT=5432
DB_USER=<database-user>
DB_PASSWORD=<database-password>
DB_NAME=clarinet_lessons
JWT_SECRET=<secret-key>
JWT_EXPIRATION=86400000
NODE_ENV=production
```

---

### Çözüm 7: package-lock.json Sorunu

package-lock.json dosyası bozuk olabilir.

**Yapılacaklar:**
1. Lokal olarak:
   ```bash
   cd backend
   rm package-lock.json
   rm -rf node_modules
   npm install
   ```

2. Değişiklikleri commit edin:
   ```bash
   git add backend/package-lock.json
   git commit -m "Fix package-lock.json"
   git push origin main
   ```

3. Render'da **"Manual Deploy"** yapın.

---

### Çözüm 8: Memory Limit

Render free tier'da memory limiti aşılmış olabilir.

**Yapılacaklar:**
1. **"Settings"** → **"Plan"** → **"Starter"** planına geçin ($7/ay)
2. Veya build command'i optimize edin:
   ```
   npm ci && npm run build
   ```
   (`npm ci` daha az memory kullanır)

---

## 🔧 Hızlı Kontrol Listesi

Render'da şunları kontrol edin:

- [ ] **Root Directory:** `backend` (önemli!)
- [ ] **Build Command:** `npm install && npm run build`
- [ ] **Start Command:** `npm run start:prod`
- [ ] **Node Version:** `18` veya `20` (veya boş)
- [ ] **Environment Variables:** Tüm değişkenler ekli
- [ ] **package.json:** `pg` paketi var
- [ ] **package.json:** `build` ve `start:prod` script'leri var

---

## 📋 Tam Hata Mesajını Paylaşın

Eğer yukarıdaki çözümler işe yaramadıysa:

1. Render Dashboard → Backend service → **"Logs"** sekmesi
2. **Tam hata mesajını** kopyalayın
3. Paylaşın, daha spesifik bir çözüm sunabilirim

---

## 🚀 Manuel Deploy

Sorun devam ederse:

1. Render Dashboard → Backend service
2. **"Manual Deploy"** → **"Clear build cache & deploy"**
3. Bu, cache'i temizler ve yeniden build eder

---

**En yaygın sorun: Root Directory `backend` olarak ayarlanmamış olabilir. Kontrol edin!**
