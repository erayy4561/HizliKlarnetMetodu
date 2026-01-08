# Projeyi Başka Bir Bilgisayara Taşıma ve Çalıştırma Kılavuzu

Bu projeyi başka bir bilgisayarda çalıştırmak için aşağıdaki adımları sırasıyla takip edin.

## 1. Hazırlık (Yeni Bilgisayarda)

Projeyi çalıştıracağınız bilgisayarda **Docker Desktop** uygulamasının yüklü ve çalışıyor olması gerekmektedir.

1. [Docker Desktop İndir](https://www.docker.com/products/docker-desktop/) adresine gidin.
2. İşletim sisteminize uygun sürümü indirin ve kurun.
3. Kurulum bitince Docker Desktop uygulamasını açın ve "Engine running" (yeşil ikon) olduğundan emin olun.

## 2. Dosyaları Taşıma

Mevcut projenizi USB bellek, Google Drive veya benzeri bir yöntemle yeni bilgisayara kopyalamanız gerekmektedir.

**Önemli İpucu:** Dosya boyutunu küçültmek ve kopyalamayı hızlandırmak için şu klasörleri **kopyalamayın** veya kopyalamadan önce **silin**:
- `backend/node_modules`
- `frontend/node_modules`
- `backend/dist`
- `frontend/dist`

Sadece kaynak kodları (`src`, `Dockerfile`, `docker-compose.yml` vb.) taşımanız yeterlidir. Docker gerekli her şeyi kendisi kuracaktır.

## 3. Projeyi Başlatma

1. Yeni bilgisayarda projeyi kopyaladığınız klasörü açın.
2. Klasörün içinde boş bir yere sağ tıklayıp **"Terminalde Aç"** (veya Git Bash, PowerShell) diyerek komut satırını açın.
3. Aşağıdaki komutu yazıp Enter'a basın:

```bash
docker-compose up -d --build
```

**Bu işlem ilk seferde 5-10 dakika sürebilir.** İnternetten gerekli paketleri indirecektir.

## 4. Kullanım

Kurulum tamamlandığında (komut satırı tekrar yazılabilir hale geldiğinde):

- **Uygulama (Frontend):** Tarayıcınızda [http://localhost](http://localhost) adresine gidin.
- **Backend API:** [http://localhost:8080](http://localhost:8080) adresinde çalışır.

## 5. Sorun Giderme

Eğer "Port already in use" (Port kullanımda) hatası alırsanız, bilgisayarda 80 veya 8080 portunu kullanan başka bir uygulama (Skype, başka web sunucusu vb.) vardır. Bu durumda `docker-compose.yml` dosyasını not defteri ile açıp sol taraftaki portları değiştirebilirsiniz (örneğin `"80:80"` yerine `"8090:80"`).

## Yönetici Hesabı
Eğer veritabanı sıfırdan kurulduysa, yeni bir hesap oluşturup veritabanından yetki vermeniz gerekebilir. Veritabanı verileri `docker-compose.yml` içindeki volume ayarı sayesinde taşınabilir, ancak sadece kodları taşıdıysanız veritabanı boş başlayacaktır.
