# Render'da Node.js Versiyonu Ayarlama

## 🎯 Node.js Versiyonu Neden Önemli?

Render'da Node.js versiyonu belirtilmezse, varsayılan versiyon kullanılır ve bu uyumsuzluklara neden olabilir.

---

## ✅ Çözüm 1: package.json'da engines (Önerilen)

**Zaten yaptık!** `backend/package.json` dosyasına şunu ekledik:

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

Render bu ayarı otomatik olarak algılar ve Node.js 18 veya üstünü kullanır.

---

## ✅ Çözüm 2: .nvmrc Dosyası Oluşturma

Alternatif olarak, `backend/` klasörüne `.nvmrc` dosyası oluşturabilirsiniz.

### Adımlar:

1. `backend/.nvmrc` dosyası oluşturun
2. İçine şunu yazın:
   ```
   18
   ```
   veya
   ```
   20
   ```

Render bu dosyayı da otomatik algılar.

---

## 🔍 Render Dashboard'da Kontrol

Render dashboard'da Node.js versiyonu ayarı **doğrudan görünmez**. Render şu sırayla kontrol eder:

1. **`.nvmrc` dosyası** (varsa)
2. **`package.json` içindeki `engines.node`** (varsa)
3. **Varsayılan versiyon** (genellikle Node.js 18)

---

## 📋 Kontrol Listesi

### 1. package.json Kontrolü

`backend/package.json` dosyasında şu satırlar olmalı:

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

**✅ Zaten ekledik!**

### 2. Deploy Sonrası Kontrol

Deploy tamamlandıktan sonra:

1. Render Dashboard → Backend service → **"Logs"** sekmesi
2. Logların başında şunu arayın:
   ```
   Node version: v18.x.x
   ```
   veya
   ```
   Using Node.js 18.x.x
   ```

### 3. Build Loglarını Kontrol

Build sırasında loglarda Node.js versiyonu görünecektir:

```
Installing Node.js 18.x.x
```

---

## 🚀 Şimdi Ne Yapmalısınız?

### Adım 1: Değişiklikleri Push Edin

`package.json`'a `engines` ekledik. Eğer henüz push etmediyseniz:

```bash
git add backend/package.json
git commit -m "Add Node.js version requirement"
git push origin main
```

### Adım 2: Render'da Redeploy

1. Render Dashboard → Backend service
2. **"Manual Deploy"** → **"Clear build cache & deploy"**
3. Bu, cache'i temizler ve yeni ayarlarla build eder

### Adım 3: Logları Kontrol Edin

Deploy başladıktan sonra:

1. **"Logs"** sekmesine gidin
2. Node.js versiyonunu kontrol edin
3. Build'in başarılı olup olmadığını kontrol edin

---

## ⚠️ Önemli Notlar

1. **Render Dashboard'da görünmez:** Node.js versiyonu ayarı Render dashboard'da görünmez, sadece `package.json` veya `.nvmrc` dosyasından algılanır.

2. **Cache temizleme:** Eğer hala eski versiyon kullanılıyorsa, **"Clear build cache & deploy"** yapın.

3. **package.json öncelikli:** Hem `package.json` hem `.nvmrc` varsa, `package.json` önceliklidir.

---

## 🔧 Alternatif: .nvmrc Dosyası Eklemek

Eğer `.nvmrc` dosyası da eklemek isterseniz:

1. `backend/.nvmrc` dosyası oluşturun
2. İçine `18` yazın
3. Commit edin ve push edin

---

## ✅ Özet

- ✅ `package.json`'a `engines` ekledik
- ✅ Render otomatik algılayacak
- ✅ Dashboard'da görünmez (normal)
- ✅ Loglarda kontrol edebilirsiniz

**Render'da Node.js versiyonu artık otomatik olarak 18 veya üstünü kullanacak!**
