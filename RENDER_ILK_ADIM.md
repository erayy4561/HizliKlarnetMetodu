# Render - İlk Adım: Database Oluşturma

## 🎯 Şu An Yapmanız Gereken

Render'da "New +" butonuna tıkladığınızda gördüğünüz seçeneklerden:

**"Postgres"** seçin! ✅

---

## 📝 Adım Adım

### 1. "Postgres" Seçin
- Menüden **"Postgres"** seçeneğine tıklayın
- Bu, PostgreSQL database oluşturacak

### 2. Database Ayarları

Açılan formda şu bilgileri girin:

#### Name (İsim)
- **Name**: `clarinet-lessons-db`
- Bu isim sadece Render dashboard'unda görünür

#### Database (Veritabanı Adı)
- **Database**: `clarinet_lessons`
- Bu, gerçek veritabanı adıdır

#### User (Kullanıcı)
- **User**: `app` (veya boş bırakın, Render otomatik oluşturur)

#### Region (Bölge)
- **Region**: Size en yakın bölgeyi seçin
  - Örnek: `Frankfurt (EU)`, `Oregon (US West)`, `Singapore (Asia)`
  - Türkiye için: `Frankfurt (EU)` iyi bir seçenek

#### PostgreSQL Version
- **Version**: En son sürümü seçin (varsayılan genellikle iyidir)

#### Plan (Plan)
- **Free** planı seçin (ücretsiz)
  - 750 saat/ay
  - 1 GB storage
  - 256 MB RAM
- Veya **Starter** plan ($7/ay) - daha iyi performans için

### 3. "Create Database" Butonuna Tıklayın
- Tüm ayarları yaptıktan sonra **"Create Database"** butonuna tıklayın
- Database oluşturulması 2-3 dakika sürebilir

---

## 📋 Database Hazır Olduktan Sonra

Database oluşturulduktan sonra:

1. **Database Dashboard'a gidin**
   - Oluşturduğunuz database'e tıklayın

2. **"Connections" sekmesine gidin**
   - Burada database bağlantı bilgilerini göreceksiniz

3. **Şu bilgileri not edin:**
   ```
   Internal Database URL: postgresql://user:password@host:5432/database
   Host: xxxxx.render.com
   Port: 5432
   Database: clarinet_lessons
   User: app (veya sizin belirlediğiniz)
   Password: (Render'da gösterilir - kopyalayın!)
   ```

4. **"Internal Database URL"** tamamını kopyalayın
   - Bu URL'i backend environment variables'da kullanacağız

---

## ⏭️ Sonraki Adım: Backend Deployment

Database hazır olduktan sonra:

1. Tekrar **"New +"** butonuna tıklayın
2. Bu sefer **"Web Services"** seçin
3. Backend deployment'a geçin

---

## 🔍 Görsel Rehber

Render'da "New +" butonuna tıkladığınızda şöyle bir menü görürsünüz:

```
┌─────────────────────────────┐
│  New +                       │
├─────────────────────────────┤
│  Static Sites               │
│  Web Services               │
│  Private Services           │
│  Background Workers         │
│  Cron Jobs                  │
│  Postgres          ← BUNU SEÇİN ✅
│  Key Value                  │
└─────────────────────────────┘
```

**"Postgres"** seçeneğine tıklayın!

---

## ⚠️ Önemli Not

Backend kodunuz şu anda **MySQL** kullanıyor. Render'da **PostgreSQL** kullanacağız, bu yüzden backend kodunu PostgreSQL'e uyarlamamız gerekecek.

Database oluşturduktan sonra backend kodunu güncelleyeceğiz.

---

**Şimdi: "New +" → "Postgres" seçin ve database oluşturun!**
