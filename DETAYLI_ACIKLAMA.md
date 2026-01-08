# HIZLI KLARNET METODU - Detaylı Kod Açıklaması

Bu dokümantasyon, projedeki tüm dosya ve klasörlerin ne işe yaradığını, neden var olduğunu ve önemli kod bloklarını açıklar.

---

## 1. Kök Dizin (Root Directory)

Projenin ana dizini. Backend ve frontend'i bir arada tutar.

### 1.1. `package-lock.json`
- **İşlevi:** Node.js bağımlılıklarının tam versiyonlarını tutar
- **Neden var:** Paket versiyonlarının tutarlılığını sağlar, farklı makinelerde aynı paketlerin yüklenmesini garanti eder
- **Önemli:** Git'e commit edilmelidir

### 1.2. `README.md`
- **İşlevi:** Projenin genel açıklaması, kurulum talimatları
- **Neden var:** Projeyi ilk kez görenler için rehber

### 1.3. `docker-compose.yml`
- **İşlevi:** Tüm servisleri (database, backend, frontend) tek komutla çalıştırır
- **Neden var:** Geliştirme ortamını kolaylaştırır, production benzeri bir ortam sağlar
- **Önemli kod blokları:**
  ```yaml
  services:
    db:          # MySQL database servisi
    backend:     # NestJS backend servisi
    frontend:    # React frontend servisi
  ```
- **Kullanım:** `docker-compose up` komutu ile tüm servisleri başlatır

### 1.4. `cursor.rapor`
- **İşlevi:** Projenin teknik mimari raporu
- **Neden var:** Proje dokümantasyonu, şart kontrol raporu

### 1.5. `DEPLOYMENT.md`
- **İşlevi:** Deployment (yayınlama) talimatları
- **Neden var:** Uygulamayı canlıya almak için rehber

### 1.6. `RENDER_WEB_SERVICE_KURULUM.md`
- **İşlevi:** Render platformunda backend deployment kılavuzu
- **Neden var:** Render'a deploy etmek için adım adım talimatlar

---

## 2. `backend/` - Backend Klasörü

NestJS framework'ü ile yazılmış RESTful API backend'i.

### 2.1. `backend/package.json`
- **İşlevi:** Backend bağımlılıklarını ve script'leri tanımlar
- **Neden var:** Node.js projesinin yapılandırması
- **Önemli bağımlılıklar:**
  - `@nestjs/core`: NestJS framework'ü
  - `@nestjs/typeorm`: Veritabanı ORM
  - `@nestjs/jwt`: JWT token işlemleri
  - `pg`: PostgreSQL driver
  - `bcrypt`: Şifre hashleme
- **Önemli script'ler:**
  - `npm run build`: TypeScript'i JavaScript'e derler
  - `npm run start:prod`: Production modunda çalıştırır

### 2.2. `backend/package-lock.json`
- **İşlevi:** Backend paket versiyonlarını kilitleme
- **Neden var:** Tutarlı bağımlılık yönetimi

### 2.3. `backend/tsconfig.json`
- **İşlevi:** TypeScript derleyici ayarları
- **Neden var:** TypeScript kodunun nasıl derleneceğini belirler
- **Önemli ayarlar:**
  - `target: "ES2021"`: Modern JavaScript özellikleri
  - `module: "commonjs"`: Node.js için modül sistemi
  - `strict: true`: Katı tip kontrolü

### 2.4. `backend/tsconfig.build.json`
- **İşlevi:** Build için özel TypeScript ayarları
- **Neden var:** Build sırasında test dosyalarını hariç tutar

### 2.5. `backend/nest-cli.json`
- **İşlevi:** NestJS CLI yapılandırması
- **Neden var:** NestJS'in build ve generate komutlarını yapılandırır

### 2.6. `backend/eslint.config.mjs`
- **İşlevi:** ESLint kod kalitesi kuralları
- **Neden var:** Kod standartlarını korur, hataları önler

### 2.7. `backend/Dockerfile`
- **İşlevi:** Backend için Docker image tanımı
- **Neden var:** Backend'i containerize etmek için
- **Önemli kod blokları:**
  ```dockerfile
  FROM node:18-alpine        # Node.js 18 Alpine image'i kullan
  WORKDIR /app               # Çalışma dizini
  COPY package*.json ./      # Paket dosyalarını kopyala
  RUN npm install            # Bağımlılıkları yükle
  COPY . .                   # Tüm kodu kopyala
  RUN npm run build          # Projeyi build et
  EXPOSE 8080                # 8080 portunu aç
  CMD ["npm", "run", "start:prod"]  # Production modunda başlat
  ```

### 2.8. `backend/README.md`
- **İşlevi:** Backend için özel dokümantasyon
- **Neden var:** Backend geliştiricileri için rehber

### 2.9. `backend/database.sqlite`
- **İşlevi:** SQLite veritabanı dosyası (geliştirme için)
- **Neden var:** Lokal geliştirmede MySQL yerine SQLite kullanılabilir
- **Not:** Production'da PostgreSQL kullanılıyor

### 2.10. `backend/error.log`
- **İşlevi:** Backend hata logları
- **Neden var:** Hataları takip etmek için

### 2.11. `backend/backend_log.txt`
- **İşlevi:** Backend çalışma logları
- **Neden var:** Debugging için

### 2.12. `backend/node_modules/`
- **İşlevi:** Yüklenen npm paketleri
- **Neden var:** Bağımlılıklar burada saklanır
- **Not:** Git'e commit edilmez (.gitignore'da)

### 2.13. `backend/dist/` - Build Çıktısı
- **İşlevi:** TypeScript'in derlenmiş JavaScript çıktıları
- **Neden var:** Production'da çalıştırılacak kod burada
- **Not:** `npm run build` komutu ile oluşturulur

#### 2.13.1. `backend/dist/main.js`
- **İşlevi:** Uygulamanın giriş noktası (derlenmiş)
- **Neden var:** Node.js bu dosyayı çalıştırır

#### 2.13.2. `backend/dist/*.d.ts`
- **İşlevi:** TypeScript tip tanımları
- **Neden var:** TypeScript projelerinde tip desteği için

#### 2.13.3. `backend/dist/*.js.map`
- **İşlevi:** Source map dosyaları
- **Neden var:** Debugging sırasında orijinal TypeScript kodunu görmek için

### 2.14. `backend/target/` - Java Build Çıktısı
- **İşlevi:** Java build çıktıları (muhtemelen IDE tarafından oluşturulmuş)
- **Neden var:** Bazı IDE'ler bu klasörü oluşturur
- **Not:** Bu projede kullanılmıyor, silinebilir

### 2.15. `backend/test/` - Test Dosyaları
- **İşlevi:** E2E (end-to-end) test dosyaları
- **Neden var:** Uygulamanın tamamını test etmek için

#### 2.15.1. `backend/test/app.e2e-spec.ts`
- **İşlevi:** Ana uygulama için E2E testleri
- **Neden var:** Uygulamanın çalışıp çalışmadığını test eder

#### 2.15.2. `backend/test/jest-e2e.json`
- **İşlevi:** Jest E2E test yapılandırması
- **Neden var:** E2E testlerinin nasıl çalışacağını belirler

### 2.16. `backend/src/` - Kaynak Kodlar
Backend'in tüm kaynak kodları burada.

#### 2.16.1. `backend/src/main.ts` - Uygulama Giriş Noktası
- **İşlevi:** NestJS uygulamasını başlatır, CORS ayarlarını yapar
- **Neden var:** Uygulamanın başlangıç noktası
- **Önemli kod blokları:**
  ```typescript
  // Express adapter ile NestJS uygulaması oluştur
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  
  // Tüm route'lara '/api' prefix'i ekle
  app.setGlobalPrefix('api');
  
  // CORS middleware'i - tüm origin'lere izin ver
  expressApp.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    // OPTIONS request'lerini handle et (preflight)
    if (req.method === 'OPTIONS') {
      return res.status(204).send();
    }
    next();
  });
  
  // Port'u environment variable'dan al, yoksa 8080 kullan
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  ```
- **Neden önemli:** CORS ayarları burada yapılır, uygulama buradan başlar

#### 2.16.2. `backend/src/app.module.ts` - Ana Modül
- **İşlevi:** Tüm modülleri bir araya getirir, veritabanı bağlantısını yapılandırır
- **Neden var:** NestJS'in modüler yapısının merkezi
- **Önemli kod blokları:**
  ```typescript
  TypeOrmModule.forRoot({
    type: 'postgres',                    // PostgreSQL kullan
    host: process.env.DB_HOST,           // Database host'u
    port: parseInt(process.env.DB_PORT),  // Database port'u
    username: process.env.DB_USER,       // Database kullanıcı adı
    password: process.env.DB_PASSWORD,   // Database şifresi
    database: process.env.DB_NAME,       // Database adı
    entities: [__dirname + '/**/*.entity{.ts,.js}'],  // Entity'leri otomatik bul
    synchronize: true,                   // Otomatik tablo oluştur/güncelle
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })
  ```
- **Neden önemli:** Veritabanı bağlantısı ve tüm modüller burada tanımlanır

#### 2.16.3. `backend/src/app.module.postgresql.ts`
- **İşlevi:** PostgreSQL için alternatif modül (kullanılmıyor)
- **Neden var:** Geçici olarak oluşturulmuş, şu an `app.module.ts` kullanılıyor

#### 2.16.4. `backend/src/app.controller.ts` - Ana Controller
- **İşlevi:** Basit health-check endpoint'i ve kullanıcı profil endpoint'i
- **Neden var:** Uygulamanın çalışıp çalışmadığını kontrol etmek için
- **Önemli kod blokları:**
  ```typescript
  @Get()  // GET /api
  getHello(): string {
    return this.appService.getHello();  // "Hello World!" döner
  }
  
  @UseGuards(JwtAuthGuard)  // JWT token kontrolü
  @Get('me')  // GET /api/me
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);  // Token'dan kullanıcı bilgisi
  }
  ```

#### 2.16.5. `backend/src/app.service.ts` - Ana Service
- **İşlevi:** Basit "Hello World!" mesajı döner
- **Neden var:** Health-check için

#### 2.16.6. `backend/src/app.controller.spec.ts`
- **İşlevi:** `app.controller.ts` için unit testleri
- **Neden var:** Kod kalitesini garantilemek için

### 2.17. `backend/src/auth/` - Kimlik Doğrulama Modülü
Kullanıcı girişi, kayıt ve JWT token yönetimi.

#### 2.17.1. `backend/src/auth/auth.module.ts`
- **İşlevi:** Auth modülünü yapılandırır, JWT modülünü ayarlar
- **Neden var:** Auth ile ilgili tüm bileşenleri bir araya getirir
- **Önemli kod blokları:**
  ```typescript
  JwtModule.registerAsync({
    secret: configService.get<string>('JWT_SECRET'),  // Environment variable'dan al
    signOptions: { expiresIn: '1d' }  // Token 1 gün geçerli
  })
  ```

#### 2.17.2. `backend/src/auth/auth.controller.ts` - Auth Controller
- **İşlevi:** Login, register ve profile endpoint'lerini handle eder
- **Neden var:** HTTP request'lerini karşılar
- **Önemli kod blokları:**
  ```typescript
  @Post('login')  // POST /api/auth/login
  async login(@Body() req) {
    // Kullanıcı adı ve şifre kontrolü
    if (!req.username || !req.password) {
      throw new UnauthorizedException('Username and password are required');
    }
    // Kullanıcıyı doğrula
    const user = await this.authService.validateUser(req.username, req.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // JWT token oluştur ve döndür
    return this.authService.login(user);
  }
  
  @Post('register')  // POST /api/auth/register
  async register(@Body() createUserDto) {
    return this.authService.register(createUserDto);  // Yeni kullanıcı oluştur ve token döndür
  }
  
  @UseGuards(JwtAuthGuard)  // JWT token kontrolü
  @Get('profile')  // GET /api/auth/profile
  async getProfile(@Request() req) {
    // Token'dan kullanıcı bilgisini al ve döndür
    return this.usersService.findById(req.user.userId);
  }
  ```

#### 2.17.3. `backend/src/auth/auth.service.ts` - Auth Service
- **İşlevi:** Kullanıcı doğrulama, login ve register iş mantığı
- **Neden var:** İş mantığı controller'dan ayrı tutulur
- **Önemli kod blokları:**
  ```typescript
  async validateUser(username: string, pass: string): Promise<any> {
    // Kullanıcıyı veritabanından bul
    const user = await this.usersService.findOne(username);
    
    if (user && user.password) {
      // Şifreyi bcrypt ile karşılaştır
      const isMatch = await bcrypt.compare(pass, user.password);
      
      if (isMatch) {
        const { password, ...result } = user;  // Şifreyi çıkar
        return result;  // Kullanıcı bilgilerini döndür
      }
    }
    return null;  // Kullanıcı bulunamadı veya şifre yanlış
  }
  
  async login(user: any) {
    // JWT payload oluştur
    const payload = { 
      username: user.username, 
      sub: user.id,           // Subject (kullanıcı ID'si)
      roles: [user.accountType] // Kullanıcı rolleri
    };
    // JWT token oluştur ve döndür
    return {
      token: this.jwtService.sign(payload)
    };
  }
  ```

#### 2.17.4. `backend/src/auth/jwt.strategy.ts` - JWT Strategy
- **İşlevi:** JWT token'larını doğrular ve kullanıcı bilgisini çıkarır
- **Neden var:** Passport.js JWT authentication stratejisi
- **Önemli kod blokları:**
  ```typescript
  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Bearer token'dan al
    ignoreExpiration: false,  // Expiration kontrolü yap
    secretOrKey: configService.get<string>('JWT_SECRET')  // Secret key'i environment'tan al
  });
  
  async validate(payload: any) {
    // Token'dan kullanıcı bilgisini çıkar ve request'e ekle
    return { 
      userId: payload.sub,      // Kullanıcı ID'si
      username: payload.username,
      roles: payload.roles 
    };
  }
  ```

#### 2.17.5. `backend/src/auth/jwt-auth.guard.ts` - JWT Guard
- **İşlevi:** Route'ları korur, JWT token kontrolü yapar
- **Neden var:** Korumalı endpoint'ler için
- **Kullanım:** `@UseGuards(JwtAuthGuard)` decorator'ü ile kullanılır

#### 2.17.6. `backend/src/auth/auth.controller.spec.ts` ve `auth.service.spec.ts`
- **İşlevi:** Unit testleri
- **Neden var:** Kod kalitesini garantilemek için

### 2.18. `backend/src/users/` - Kullanıcı Modülü
Kullanıcı CRUD işlemleri ve entity tanımı.

#### 2.18.1. `backend/src/users/user.entity.ts` - User Entity
- **İşlevi:** Veritabanındaki `users` tablosunu tanımlar
- **Neden var:** TypeORM ile veritabanı şemasını yönetmek için
- **Önemli kod blokları:**
  ```typescript
  @Entity('users')  // Veritabanı tablo adı
  export class User {
    @PrimaryGeneratedColumn()  // Otomatik artan ID
    id: number;
    
    @Column({ unique: true })  // Benzersiz kullanıcı adı
    username: string;
    
    @Column({ unique: true })  // Benzersiz email
    email: string;
    
    @Column()  // Hashlenmiş şifre
    password?: string;
    
    @Column({
      type: 'varchar',
      default: AccountType.STANDARD,  // Varsayılan rol: STANDARD
      name: 'account_type'  // Veritabanında snake_case
    })
    accountType: AccountType;  // STANDARD, ADMIN, SUPERADMIN
    
    @ManyToMany(() => Course, (course) => course.students)  // Çoka-çok ilişki
    @JoinTable({
      name: 'user_courses',  // Join tablo adı
      joinColumn: { name: 'user_id' },
      inverseJoinColumn: { name: 'course_id' }
    })
    courses: Course[];  // Kullanıcının kayıtlı olduğu kurslar
  }
  ```
- **Neden önemli:** Veritabanı şeması burada tanımlanır, ilişkiler burada kurulur

#### 2.18.2. `backend/src/users/users.service.ts` - Users Service
- **İşlevi:** Kullanıcı CRUD işlemleri (create, read, update, delete)
- **Neden var:** İş mantığı
- **Önemli metodlar:**
  - `findOne(username)`: Kullanıcı adına göre kullanıcı bul
  - `findById(id)`: ID'ye göre kullanıcı bul
  - `create(userData)`: Yeni kullanıcı oluştur (şifreyi hashle)

#### 2.18.3. `backend/src/users/users.controller.ts` - Users Controller
- **İşlevi:** Kullanıcı endpoint'lerini handle eder
- **Neden var:** HTTP request'lerini karşılar

#### 2.18.4. `backend/src/users/users.module.ts`
- **İşlevi:** Users modülünü yapılandırır
- **Neden var:** Modüler yapı

#### 2.18.5. `backend/src/users/seed.service.ts` - Seed Service
- **İşlevi:** İlk çalıştırmada varsayılan superadmin kullanıcısı oluşturur
- **Neden var:** İlk kurulum için varsayılan admin hesabı
- **Önemli kod blokları:**
  ```typescript
  // Varsayılan superadmin kullanıcısı oluştur
  // Username: admin, Password: admin123 (hashlenmiş)
  ```

#### 2.18.6. `backend/src/users/users.controller.spec.ts` ve `users.service.spec.ts`
- **İşlevi:** Unit testleri

### 2.19. `backend/src/courses/` - Kurs Modülü
Kurs yönetimi (oluşturma, listeleme, kayıt).

#### 2.19.1. `backend/src/courses/course.entity.ts` - Course Entity
- **İşlevi:** Veritabanındaki `courses` tablosunu tanımlar
- **Neden var:** Kurs verilerini saklamak için
- **Önemli kod blokları:**
  ```typescript
  @Entity('courses')
  export class Course {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    title: string;  // Kurs başlığı
    
    @Column('text')
    description: string;  // Kurs açıklaması
    
    @Column()
    image_url: string;  // Kurs görseli URL'i
    
    @Column()
    level: string;  // Kurs seviyesi (başlangıç, orta, ileri)
    
    @ManyToMany(() => User, (user) => user.courses)  // Çoka-çok ilişki
    students: User[];  // Kursa kayıtlı öğrenciler
  }
  ```

#### 2.19.2. `backend/src/courses/courses.service.ts` - Courses Service
- **İşlevi:** Kurs CRUD işlemleri ve kayıt işlemleri
- **Neden var:** İş mantığı
- **Önemli metodlar:**
  - `findAll()`: Tüm kursları listele
  - `create(courseData)`: Yeni kurs oluştur
  - `enroll(userId, courseId)`: Kullanıcıyı kursa kaydet
  - `withdraw(userId, courseId)`: Kullanıcıyı kurstan çıkar

#### 2.19.3. `backend/src/courses/courses.controller.ts` - Courses Controller
- **İşlevi:** Kurs endpoint'lerini handle eder
- **Neden var:** HTTP request'lerini karşılar
- **Önemli endpoint'ler:**
  - `GET /api/courses`: Tüm kursları listele
  - `POST /api/courses`: Yeni kurs oluştur (admin)
  - `POST /api/courses/:id/enroll`: Kursa kayıt ol
  - `POST /api/courses/:id/withdraw`: Kurstan çık

### 2.20. `backend/src/quiz/` - Quiz Modülü
Quiz sonuçlarını kaydetme (portrait ve performance quiz'leri).

#### 2.20.1. `backend/src/quiz/portrait-result.entity.ts` - Portrait Result Entity
- **İşlevi:** Portrait quiz sonuçlarını saklar
- **Neden var:** Kullanıcıların quiz performanslarını takip etmek için
- **Önemli alanlar:**
  - `user_id`: Hangi kullanıcının sonucu
  - `duration`: Quiz süresi
  - `correct_answers`: Doğru cevaplar
  - `wrong_answers`: Yanlış cevaplar
  - `score_percentage`: Başarı yüzdesi

#### 2.20.2. `backend/src/quiz/performance-result.entity.ts` - Performance Result Entity
- **İşlevi:** Performance quiz sonuçlarını saklar
- **Neden var:** Performans quiz sonuçlarını takip etmek için
- **Önemli alanlar:**
  - `user_id`: Hangi kullanıcının sonucu
  - `notes_completed`: Tamamlanan notalar
  - `accuracy_percentage`: Doğruluk yüzdesi
  - `time_taken`: Geçen süre

#### 2.20.3. `backend/src/quiz/portrait-result.controller.ts`
- **İşlevi:** Portrait quiz sonuçlarını kaydetme endpoint'i
- **Neden var:** Frontend'den quiz sonuçlarını almak için

#### 2.20.4. `backend/src/quiz/performance-result.controller.ts`
- **İşlevi:** Performance quiz sonuçlarını kaydetme endpoint'i
- **Neden var:** Frontend'den quiz sonuçlarını almak için

#### 2.20.5. `backend/src/quiz/quiz.module.ts`
- **İşlevi:** Quiz modülünü yapılandırır

### 2.21. `backend/src/admin/` - Admin Modülü
Admin işlemleri (kullanıcı yönetimi).

#### 2.21.1. `backend/src/admin/admin.controller.ts` - Admin Controller
- **İşlevi:** Admin endpoint'lerini handle eder
- **Neden var:** Admin işlemleri için
- **Önemli endpoint'ler:**
  - `PUT /api/admin/users/:id/password`: Kullanıcı şifresini değiştir
  - `PUT /api/admin/users/:id/role`: Kullanıcı rolünü değiştir
  - `DELETE /api/admin/users/:id`: Kullanıcıyı sil

#### 2.21.2. `backend/src/admin/admin.module.ts`
- **İşlevi:** Admin modülünü yapılandırır

---

## 3. `frontend/` - Frontend Klasörü

React + Vite ile yazılmış kullanıcı arayüzü.

### 3.1. `frontend/package.json`
- **İşlevi:** Frontend bağımlılıklarını ve script'leri tanımlar
- **Önemli bağımlılıklar:**
  - `react`: React kütüphanesi
  - `react-router-dom`: Routing
  - `axios`: HTTP istekleri
  - `vexflow`: Müzik notasyonu çizimi
  - `pitchy`: Pitch (perde) algılama

### 3.2. `frontend/vite.config.ts` - Vite Yapılandırması
- **İşlevi:** Vite build tool'unun ayarları
- **Neden var:** Development server ve build ayarları
- **Önemli kod blokları:**
  ```typescript
  export default defineConfig({
    plugins: [react()],  // React plugin'i
    server: {
      port: 5173,  // Development server port'u
      proxy: {
        '/api': {
          target: 'http://localhost:8080',  // Backend'e proxy
          changeOrigin: true
        }
      }
    }
  })
  ```
- **Neden önemli:** Development'ta frontend ve backend'i birleştirir

### 3.3. `frontend/tsconfig.json`
- **İşlevi:** Frontend TypeScript ayarları
- **Neden var:** TypeScript derleme ayarları

### 3.4. `frontend/vercel.json`
- **İşlevi:** Vercel deployment ayarları
- **Neden var:** Vercel'de frontend'i deploy etmek için
- **Önemli kod blokları:**
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- **Neden önemli:** React Router için SPA routing desteği

### 3.5. `frontend/Dockerfile`
- **İşlevi:** Frontend için Docker image tanımı
- **Neden var:** Frontend'i containerize etmek için

### 3.6. `frontend/nginx/nginx.conf`
- **İşlevi:** Nginx web server yapılandırması
- **Neden var:** Production'da static dosyaları serve etmek için

### 3.7. `frontend/index.html`
- **İşlevi:** HTML giriş noktası
- **Neden var:** React uygulamasının mount edileceği yer

### 3.8. `frontend/public/` - Public Dosyalar
- **İşlevi:** Statik dosyalar (görseller, favicon)
- **Neden var:** Build sırasında kopyalanır, direkt erişilebilir

#### 3.8.1. `frontend/public/logo_large.png`
- **İşlevi:** Uygulama logosu
- **Neden var:** Görsel kimlik

#### 3.8.2. `frontend/public/favicon.png`
- **İşlevi:** Tarayıcı sekmesi ikonu
- **Neden var:** Görsel kimlik

#### 3.8.3. `frontend/public/Eray.hoca.klarnet.jpg`
- **İşlevi:** Eğitmen görseli
- **Neden var:** İçerik

### 3.9. `frontend/dist/` - Build Çıktısı
- **İşlevi:** Vite'nin build çıktıları
- **Neden var:** Production'da serve edilecek dosyalar
- **Not:** `npm run build` komutu ile oluşturulur

### 3.10. `frontend/src/` - Kaynak Kodlar
Frontend'in tüm kaynak kodları burada.

#### 3.10.1. `frontend/src/main.tsx` - Uygulama Giriş Noktası
- **İşlevi:** React uygulamasını başlatır
- **Neden var:** Uygulamanın başlangıç noktası
- **Önemli kod blokları:**
  ```typescript
  const root = createRoot(container)  // React 18 root API
  
  root.render(
    <React.StrictMode>  // Strict mode (geliştirme için)
      <AuthProvider>  // Auth context provider
        <RouterProvider router={router} />  // Router provider
      </AuthProvider>
    </React.StrictMode>
  )
  ```

#### 3.10.2. `frontend/src/router.tsx` - Routing Yapılandırması
- **İşlevi:** Tüm route'ları tanımlar
- **Neden var:** Sayfa yönlendirmeleri
- **Önemli kod blokları:**
  ```typescript
  export const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,  // Ana layout
      children: [
        { index: true, element: <Home /> },  // Ana sayfa
        { path: 'login', element: <Login /> },  // Giriş sayfası
        { path: 'tuner', element: <Tuner /> },  // Akort aracı
        { path: 'metronome', element: <Metronome /> },  // Metronom
        { path: 'quiz', element: <Quiz /> },  // Quiz seçim sayfası
        { path: 'quiz/portrait', element: <QuizPortrait /> },  // Portrait quiz
        { path: 'quiz/performance', element: <QuizPerformance /> },  // Performance quiz
        { path: 'courses', element: (<Protected><Courses /></Protected>) },  // Kurslar (korumalı)
        { path: 'profile', element: (<Protected><Profile /></Protected>) },  // Profil (korunmalı)
        { path: 'users/:id', element: (<Protected><UserDetail /></Protected>) },  // Kullanıcı detayı (korunmalı)
      ]
    }
  ])
  ```

#### 3.10.3. `frontend/src/styles.css` - Global Stiller
- **İşlevi:** Tüm uygulama için global CSS stilleri
- **Neden var:** Tutarlı görünüm

#### 3.10.4. `frontend/src/i18n.ts` - Çoklu Dil Desteği
- **İşlevi:** Dil yapılandırması (i18n)
- **Neden var:** Çoklu dil desteği için (şu an kullanılmıyor olabilir)

#### 3.10.5. `frontend/src/vite-env.d.ts` - Vite Tip Tanımları
- **İşlevi:** Vite environment variable'ları için tip tanımları
- **Neden var:** TypeScript tip desteği
- **Önemli kod blokları:**
  ```typescript
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;  // Backend URL'i
  }
  ```

### 3.11. `frontend/src/context/` - Context API
React Context API ile global state yönetimi.

#### 3.11.1. `frontend/src/context/AuthContext.tsx` - Auth Context
- **İşlevi:** Kullanıcı authentication state'ini yönetir
- **Neden var:** Tüm uygulamada kullanıcı bilgisine erişim
- **Önemli kod blokları:**
  ```typescript
  // Token ve kullanıcı state'i
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<User>(null)
  
  // Token değiştiğinde localStorage'a kaydet ve API'ye ekle
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      setAuthToken(token)  // Axios header'ına ekle
      void loadMe()  // Kullanıcı bilgisini yükle
    } else {
      setAuthToken(null)
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token, loadMe])
  
  // Login fonksiyonu
  async function login(username: string, password: string) {
    const res = await api.post('/auth/login', { username, password })
    if (res.data && res.data.token) {
      setToken(res.data.token)  // Token'ı state'e kaydet
      return true
    }
    return false
  }
  
  // loadMe fonksiyonu - Token'dan kullanıcı bilgisini al
  const loadMe = useCallback(async () => {
    if (!token) return
    try {
      const res = await api.get('/auth/profile')
      setUser(res.data)  // Kullanıcı bilgisini state'e kaydet
    } catch (error: any) {
      // 401 veya 403 hatası varsa token'ı temizle
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        setAuthToken(null)
      }
    }
  }, [token])
  ```
- **Neden önemli:** Tüm uygulama boyunca authentication state'ini yönetir

### 3.12. `frontend/src/utils/` - Yardımcı Fonksiyonlar
Yeniden kullanılabilir yardımcı fonksiyonlar.

#### 3.12.1. `frontend/src/utils/api.ts` - API Client
- **İşlevi:** Merkezi Axios instance'ı ve token yönetimi
- **Neden var:** Tüm API çağrılarını tek yerden yönetmek
- **Önemli kod blokları:**
  ```typescript
  // Axios instance oluştur
  export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',  // Backend URL'i
  })
  
  // Token'ı Axios header'ına ekle/kaldır
  export function setAuthToken(token: string | null) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }
  
  // Sayfa yüklendiğinde localStorage'dan token'ı al ve header'a ekle
  const savedToken = localStorage.getItem('token')
  if (savedToken) {
    setAuthToken(savedToken)
  }
  ```
- **Neden önemli:** Tüm API çağrıları bu instance üzerinden yapılır, token otomatik eklenir

#### 3.12.2. `frontend/src/utils/pitch.ts` - Pitch Yardımcı Fonksiyonları
- **İşlevi:** Pitch (perde) hesaplama fonksiyonları
- **Neden var:** Tuner bileşeninde kullanılır

### 3.13. `frontend/src/ui/` - UI Bileşenleri
Yeniden kullanılabilir UI bileşenleri.

#### 3.13.1. `frontend/src/ui/AppLayout.tsx` - Ana Layout
- **İşlevi:** Tüm sayfalar için ortak layout (header, navigation)
- **Neden var:** Tutarlı görünüm ve navigasyon

#### 3.13.2. `frontend/src/ui/Protected.tsx` - Korumalı Route Bileşeni
- **İşlevi:** Korumalı route'lar için wrapper bileşeni
- **Neden var:** Sadece giriş yapmış kullanıcıların erişebileceği sayfalar
- **Önemli kod blokları:**
  ```typescript
  export function Protected({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()  // Auth context'ten kullanıcı bilgisini al
    
    if (!user) {
      return <Navigate to="/login" />  // Kullanıcı yoksa login'e yönlendir
    }
    
    return <>{children}</>  // Kullanıcı varsa içeriği göster
  }
  ```

### 3.14. `frontend/src/views/` - Sayfa Bileşenleri
Her sayfa için ayrı bileşen.

#### 3.14.1. `frontend/src/views/Home.tsx` - Ana Sayfa
- **İşlevi:** Uygulamanın ana sayfası
- **Neden var:** Kullanıcıları karşılamak, uygulama hakkında bilgi vermek

#### 3.14.2. `frontend/src/views/Login.tsx` - Giriş/Kayıt Sayfası
- **İşlevi:** Kullanıcı girişi ve kayıt formu
- **Neden var:** Authentication işlemleri
- **Önemli kod blokları:**
  ```typescript
  // Login fonksiyonu
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(username.trim(), password)
    if (success) {
      navigate('/profile')  // Başarılıysa profile'a yönlendir
    } else {
      setError('Giriş başarısız')  // Hata mesajı göster
    }
  }
  
  // Register fonksiyonu
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await register(username.trim(), password, email.trim())
    if (success) {
      navigate('/profile')  // Başarılıysa profile'a yönlendir
    } else {
      setError('Kayıt başarısız')  // Hata mesajı göster
    }
  }
  ```

#### 3.14.3. `frontend/src/views/Profile.tsx` - Profil Sayfası
- **İşlevi:** Kullanıcı profil bilgileri ve quiz sonuçları
- **Neden var:** Kullanıcının kendi bilgilerini görmesi
- **Önemli özellikler:**
  - Kullanıcı bilgileri
  - Quiz sonuçları listesi
  - Admin paneli (admin kullanıcılar için)

#### 3.14.4. `frontend/src/views/Courses.tsx` - Kurslar Sayfası
- **İşlevi:** Kurs listesi ve kayıt işlemleri
- **Neden var:** Kullanıcıların kursları görmesi ve kayıt olması
- **Önemli kod blokları:**
  ```typescript
  // Kurslara kayıt ol
  const handleEnroll = async (courseId: number) => {
    await api.post(`/courses/${courseId}/enroll`)
    // Kurs listesini yenile
  }
  
  // Kurstan çık
  const handleWithdraw = async (courseId: number) => {
    await api.post(`/courses/${courseId}/withdraw`)
    // Kurs listesini yenile
  }
  ```

#### 3.14.5. `frontend/src/views/Tuner.tsx` - Akort Aracı
- **İşlevi:** Mikrofon ile nota algılama ve akort kontrolü
- **Neden var:** Kullanıcıların enstrümanlarını akort etmesi
- **Önemli kod blokları:**
  ```typescript
  // Pitchy kütüphanesi ile mikrofon sesini dinle
  const { pitch, clarity } = Pitchy.detectPitch(audioContext, analyserNode)
  
  // Nota hesapla ve akort durumunu göster
  ```

#### 3.14.6. `frontend/src/views/Metronome.tsx` - Metronom
- **İşlevi:** Ritim tutma aracı
- **Neden var:** Kullanıcıların ritim çalışması

#### 3.14.7. `frontend/src/views/Quiz.tsx` - Quiz Seçim Sayfası
- **İşlevi:** Quiz türlerini seçme sayfası
- **Neden var:** Kullanıcıların quiz türünü seçmesi

#### 3.14.8. `frontend/src/views/QuizPortrait.tsx` - Portrait Quiz
- **İşlevi:** Portre göstererek nota tahmin etme quiz'i
- **Neden var:** Kullanıcıların nota okuma becerisini test etmek
- **Önemli kod blokları:**
  ```typescript
  // VexFlow ile nota çiz
  const renderNote = (note: string) => {
    // VexFlow API kullanarak nota çizimi
  }
  
  // Quiz sonucunu kaydet
  const saveResult = async () => {
    await api.post('/quiz/portrait-result', {
      duration,
      correct_answers,
      wrong_answers,
      score_percentage
    })
  }
  ```

#### 3.14.9. `frontend/src/views/QuizPerformance.tsx` - Performance Quiz
- **İşlevi:** Mikrofon ile çalınan notaları algılama quiz'i
- **Neden var:** Kullanıcıların çalma becerisini test etmek
- **Önemli kod blokları:**
  ```typescript
  // Pitchy ile çalınan notayı algıla
  const detectNote = () => {
    const { pitch } = Pitchy.detectPitch(audioContext, analyserNode)
    // Nota hesapla ve doğruluğu kontrol et
  }
  
  // Quiz sonucunu kaydet
  const saveResult = async () => {
    await api.post('/quiz/performance-result', {
      notes_completed,
      accuracy_percentage,
      time_taken
    })
  }
  ```

#### 3.14.10. `frontend/src/views/UserDetail.tsx` - Kullanıcı Detay Sayfası
- **İşlevi:** Admin için kullanıcı detay sayfası
- **Neden var:** Admin'lerin kullanıcıları yönetmesi
- **Önemli özellikler:**
  - Kullanıcı bilgileri
  - Şifre değiştirme
  - Rol değiştirme
  - Kullanıcı silme

---

## 4. Önemli Kod Blokları Özeti

### 4.1. Backend - CORS Yapılandırması
```typescript
// main.ts
expressApp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }
  next();
});
```
**Neden önemli:** Frontend ve backend farklı origin'lerde çalıştığı için CORS gerekli.

### 4.2. Backend - JWT Token Oluşturma
```typescript
// auth.service.ts
async login(user: any) {
  const payload = { username: user.username, sub: user.id, roles: [user.accountType] };
  return { token: this.jwtService.sign(payload) };
}
```
**Neden önemli:** Güvenli authentication için JWT token kullanılır.

### 4.3. Backend - Şifre Hashleme
```typescript
// users.service.ts
const hashedPassword = await bcrypt.hash(password, 10);
```
**Neden önemli:** Şifreler düz metin olarak saklanmaz, güvenlik için hashlenir.

### 4.4. Frontend - Token Yönetimi
```typescript
// AuthContext.tsx
useEffect(() => {
  if (token) {
    localStorage.setItem('token', token);
    setAuthToken(token);
    void loadMe();
  }
}, [token]);
```
**Neden önemli:** Token localStorage'da saklanır ve her request'te header'a eklenir.

### 4.5. Frontend - Korumalı Route
```typescript
// Protected.tsx
if (!user) {
  return <Navigate to="/login" />;
}
```
**Neden önemli:** Sadece giriş yapmış kullanıcılar korumalı sayfalara erişebilir.

---

## 5. Dosya Yapısı Özeti

```
ClarinetLessons/
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── main.ts      # Uygulama giriş noktası
│   │   ├── app.module.ts # Ana modül
│   │   ├── auth/         # Kimlik doğrulama
│   │   ├── users/       # Kullanıcı yönetimi
│   │   ├── courses/     # Kurs yönetimi
│   │   ├── quiz/        # Quiz sonuçları
│   │   └── admin/       # Admin işlemleri
│   ├── dist/            # Build çıktısı
│   └── package.json
├── frontend/            # React frontend
│   ├── src/
│   │   ├── main.tsx     # Uygulama giriş noktası
│   │   ├── router.tsx   # Routing
│   │   ├── context/      # Context API
│   │   ├── utils/       # Yardımcı fonksiyonlar
│   │   ├── ui/          # UI bileşenleri
│   │   └── views/       # Sayfa bileşenleri
│   └── package.json
└── docker-compose.yml   # Docker yapılandırması
```

---

**Bu dokümantasyon, projedeki tüm dosya ve klasörlerin işlevlerini açıklar. Her dosya, projenin çalışması için gerekli bir rol oynar.**
