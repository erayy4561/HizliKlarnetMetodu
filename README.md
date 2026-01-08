# Clarinet Lessons - Yerel Geliştirme Kılavuzu

Bu proje, **NestJS** backend ve **React** frontend içeren bir klarnet dersleri uygulamasıdır. Veritabanı olarak **MySQL** kullanır ve Docker ile tamamen konteynerize edilmiştir.

> **Baska bir bilgisayara taşımak mı istiyorsunuz?**  
> Detaylı anlatım için [DEPLOYMENT.md](DEPLOYMENT.md) dosyasını okuyun.

## Gereksinimler

- **Docker ve Docker Compose** (Önerilen)

## Yöntem 1: Docker Compose ile Çalıştırma (Önerilen)

Bu yöntem en kolay ve hızlı yöntemdir. Tüm servisler otomatik olarak başlatılır.

### Adımlar:

1. **Proje dizinine gidin:**
   ```bash
   cd C:\ClarinetLessons
   ```

2. **Docker Compose ile tüm servisleri başlatın:**
   ```bash
   docker-compose up -d
   ```

3. **Servislerin çalıştığını kontrol edin:**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - MySQL: localhost:3306

4. **Servisleri durdurmak için:**
   ```bash
   docker-compose down
   ```

5. **Logları görmek için:**
   ```bash
   docker-compose logs -f
   ```


### Önemli Notlar

- Backend varsayılan olarak `http://localhost:5173` adresinden gelen isteklere izin verir (CORS)
- Eğer frontend'i farklı bir portta çalıştırıyorsanız, `backend/src/main/resources/application.properties` dosyasındaki `app.cors.allowed-origin` değerini güncelleyin
- MySQL bağlantı bilgileri `application.properties` dosyasında ayarlanabilir

## Sorun Giderme

### Port zaten kullanılıyor hatası
- Port 80, 8080 veya 3306 kullanılıyorsa, docker-compose.yml dosyasındaki port numaralarını değiştirebilirsiniz

### MySQL bağlantı hatası
- MySQL servisinin çalıştığından emin olun
- Veritabanı kullanıcı adı ve şifresinin doğru olduğundan emin olun

### Frontend bağımlılık hataları
- `node_modules` klasörünü silin ve tekrar `npm install` çalıştırın:
  ```bash
  rm -rf node_modules
  npm install
  ```

## Proje Yapısı

```
ClarinetLessons/
├── backend/          # NestJS backend
├── frontend/         # React + Vite frontend
└── docker-compose.yml
```

## API Endpoint'leri

Backend API'si `http://localhost:8080` adresinde çalışır. API endpoint'leri için backend kodunu inceleyin.

