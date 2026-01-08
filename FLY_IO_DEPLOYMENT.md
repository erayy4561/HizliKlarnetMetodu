# Fly.io Deployment Kılavuzu

## 🚀 Fly.io Nedir?

Fly.io, edge computing odaklı bir platformdur. Ücretsiz tier sunar ve iyi performans sağlar.

**Avantajları:**
- ✅ Ücretsiz tier (3 shared-cpu-1x VM)
- ✅ Global edge network
- ✅ Hızlı deploy
- ✅ MySQL/PostgreSQL desteği

---

## 📋 Gereksinimler

1. **Fly.io hesabı**: https://fly.io → Sign Up
2. **Fly CLI**: Kurulum gerekli
3. **GitHub repository**: Kodunuz GitHub'da olmalı

---

## 🔧 Adım 1: Fly CLI Kurulumu

### Windows (PowerShell):

```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### macOS/Linux:

```bash
curl -L https://fly.io/install.sh | sh
```

### Login:

```bash
fly auth login
```

---

## 🗄️ Adım 2: MySQL Database Oluşturma

Fly.io'da MySQL için **Upstash** veya **PlanetScale** kullanabilirsiniz, veya Fly.io'nun kendi database servisini kullanabilirsiniz.

### Seçenek 1: Upstash (Önerilen)

1. https://upstash.com → Sign Up
2. **"Create Database"** → **"MySQL"**
3. Database bilgilerini not edin

### Seçenek 2: Fly.io PostgreSQL (MySQL yerine)

Fly.io'da ücretsiz PostgreSQL kullanabilirsiniz. Backend kodunu PostgreSQL'e uyarlamanız gerekir.

---

## 🔧 Adım 2: Backend Deployment

### 2.1. Fly.io App Oluşturma

Backend dizininde:

```bash
cd backend
fly launch
```

Sorulara yanıt verin:
- **App name**: `clarinet-lessons-backend` (veya istediğiniz isim)
- **Region**: En yakın bölgeyi seçin
- **PostgreSQL**: Hayır (MySQL kullanıyorsanız)
- **Redis**: Hayır

### 2.2. fly.toml Dosyası

`backend/fly.toml` dosyası oluşturulacak. Şu şekilde düzenleyin:

```toml
app = "clarinet-lessons-backend"
primary_region = "iad"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]
    force_https = true

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  [services.concurrency]
    type = "connections"
    hard_limit = 25
    soft_limit = 20

  [[services.http_checks]]
    interval = "10s"
    timeout = "2s"
    grace_period = "5s"
    method = "GET"
    path = "/api"
```

### 2.3. Environment Variables

```bash
fly secrets set DB_HOST=<database-host>
fly secrets set DB_PORT=3306
fly secrets set DB_USER=<database-user>
fly secrets set DB_PASSWORD=<database-password>
fly secrets set DB_NAME=clarinet_lessons
fly secrets set JWT_SECRET=<güçlü-bir-secret-key-min-32-karakter>
fly secrets set JWT_EXPIRATION=86400000
```

### 2.4. Deploy

```bash
fly deploy
```

### 2.5. Backend URL

Deploy tamamlandıktan sonra:
```
https://clarinet-lessons-backend.fly.dev
```

---

## 🎨 Adım 3: Frontend (Vercel'de Kalabilir)

Frontend zaten Vercel'de. Sadece `VITE_API_URL`'i güncelleyin:

```
https://clarinet-lessons-backend.fly.dev/api
```

---

## ✅ Test

Backend test:
```
https://clarinet-lessons-backend.fly.dev/api
```

---

## 💰 Ücretsiz Tier

- 3 shared-cpu-1x VM
- 3 GB storage
- 160 GB outbound data transfer

---

**Fly.io hızlı ve performanslı bir seçenektir!**
