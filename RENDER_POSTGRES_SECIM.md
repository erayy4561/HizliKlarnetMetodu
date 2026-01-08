# Render - Postgres Database Oluşturma

## 🎯 Şu An Yapmanız Gereken

Render'da "New +" butonuna tıkladığınızda gördüğünüz seçeneklerden:

**"Postgres"** seçin! ✅

---

## 📋 Seçenekler Listesi

Render'da "New +" butonuna tıkladığınızda şu seçenekler görünür:

- Static Site
- Web Service (şimdilik değil)
- Private Service (şimdilik değil)
- Background Worker (şimdilik değil)
- Cron Job (şimdilik değil)
- **Postgres** ← **BUNU SEÇİN** ✅
- Key Value (şimdilik değil)
- Project (şimdilik değil)
- Blueprint (şimdilik değil)

---

## 📝 Adım Adım: Postgres Database Oluşturma

### 1. "Postgres" Seçin
- Menüden **"Postgres"** seçeneğine tıklayın
- Bu, PostgreSQL database oluşturacak

### 2. Database Ayarları Formu

Açılan formda şu bilgileri girin:

#### Name (İsim)
- **Name**: `clarinet-lessons-db`
- Bu isim sadece Render dashboard'unda görünür
- İstediğiniz başka bir isim de kullanabilirsiniz

#### Database (Veritabanı Adı)
- **Database**: `clarinet_lessons`
- Bu, gerçek veritabanı adıdır
- Küçük harf ve alt çizgi kullanın

#### User (Kullanıcı)
- **User**: `app` (veya boş bırakın)
- Boş bırakırsanız, Render otomatik bir kullanıcı oluşturur

#### Region (Bölge)
- **Region**: Size en yakın bölgeyi seçin
  - **Frankfurt (EU)** - Türkiye için iyi seçenek
  - **Oregon (US West)**
  - **Singapore (Asia)**
  - **Ohio (US East)**

#### PostgreSQL Version
- **Version**: En son sürümü seçin
- Varsayılan genellikle iyidir (ör. PostgreSQL 16)

#### Plan (Plan)
- **Free** planı seçin (ücretsiz)
  - 750 saat/ay (yaklaşık 31 gün)
  - 1 GB storage
  - 256 MB RAM
  - 15 dakika idle sonrası uyku modu
- Veya **Starter** plan ($7/ay) - daha iyi performans için

### 3. "Create Database" Butonuna Tıklayın
- Tüm ayarları yaptıktan sonra **"Create Database"** butonuna tıklayın
- Database oluşturulması **2-3 dakika** sürebilir
- İşlem tamamlanana kadar bekleyin

---

## 📋 Database Hazır Olduktan Sonra

Database oluşturulduktan sonra:

### 1. Database Dashboard'a Gidin
- Oluşturduğunuz database'e tıklayın
- Database sayfası açılacak

### 2. "Connections" Sekmesine Gidin
- Sol menüden veya sayfanın üst kısmından **"Connections"** sekmesine tıklayın
- Burada database bağlantı bilgilerini göreceksiniz

### 3. Şu Bilgileri Not Edin

**Önemli:** Bu bilgileri bir yere kaydedin, backend deployment'da kullanacağız!

```
Internal Database URL: postgresql://user:password@host:5432/database
Host: xxxxx.render.com
Port: 5432
Database: clarinet_lessons
User: app (veya Render'ın oluşturduğu)
Password: (Render'da gösterilir - kopyalayın!)
```

**En Önemlisi:** **"Internal Database URL"** tamamını kopyalayın!
- Bu URL şu formatta olacak: `postgresql://user:password@host:5432/database`
- Bu URL'i backend environment variables'da kullanacağız

### 4. Password'ü Kopyalayın
- Password'ü görmek için **"Show"** veya **"Reveal"** butonuna tıklayın
- Password'ü kopyalayın ve güvenli bir yere kaydedin

---

## ⏭️ Sonraki Adım: Backend Deployment

Database hazır olduktan sonra:

1. Tekrar **"New +"** butonuna tıklayın
2. Bu sefer **"Web Service"** seçin
3. Backend deployment'a geçin

---

## 🔍 Görsel Rehber

Render'da "New +" butonuna tıkladığınızda şöyle bir menü görürsünüz:

```
┌─────────────────────────────┐
│  New +                       │
├─────────────────────────────┤
│  Static Site                │
│  Web Service                │
│  Private Service            │
│  Background Worker           │
│  Cron Job                   │
│  Postgres          ← BUNU SEÇİN ✅
│  Key Value                  │
│  Project                    │
│  Blueprint                  │
└─────────────────────────────┘
```

**"Postgres"** seçeneğine tıklayın!

---

## ⚠️ Önemli Notlar

1. **Backend Hazır:** Backend kodunuz PostgreSQL için güncellendi ve GitHub'a push edildi
2. **Database Bilgileri:** Database oluşturduktan sonra bağlantı bilgilerini mutlaka not edin
3. **Internal URL:** "Internal Database URL" tamamını kopyalayın, bu çok önemli!

---

## ❓ Sorun mu Yaşıyorsunuz?

### "Postgres" seçeneği görünmüyor mu?
- Render hesabınızı doğrulayın (email doğrulaması gerekebilir)
- Farklı bir tarayıcı deneyin
- Render dashboard'u yenileyin (F5)

### Database oluşturulurken hata mı alıyorsunuz?
- Region'u değiştirmeyi deneyin
- Database adını değiştirmeyi deneyin (sadece küçük harf ve alt çizgi)
- Render support'a başvurun

### Database oluşturuldu ama bilgileri göremiyorum
- Database'e tıklayın
- "Connections" sekmesine gidin
- "Show" veya "Reveal" butonuna tıklayarak password'ü görün

---

**Şimdi: "New +" → "Postgres" seçin ve database oluşturun!**

Database hazır olduktan sonra haber verin, backend deployment'a geçelim! 🚀
