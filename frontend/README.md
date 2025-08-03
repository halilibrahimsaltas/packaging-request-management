# Ambalaj Talep ve Tedarikçi Bildirim Sistemi - Frontend

Bu proje, ambalaj talepleri ve tedarikçi bildirimleri için geliştirilmiş modern bir web uygulamasıdır.

## 🚀 Özellikler

### 👤 Müşteri Modülü

- **Ürün Kataloğu**: Aktif ürünleri görüntüleme ve filtreleme
- **Sepet Sistemi**: Ürünleri miktar belirleyerek sepete ekleme
- **Sipariş Yönetimi**: Sepetteki ürünleri siparişe dönüştürme
- **Talep Takibi**: Oluşturulan taleplerin durumunu görüntüleme
- **Tedarikçi İlgileri**: Maskelenmiş tedarikçi bilgileri ile ilgi durumu

### 🏭 Tedarikçi Modülü

- **Talep Filtreleme**: Ürün tipine göre talepleri filtreleme
- **Talep Detayları**: Sipariş detaylarını görüntüleme
- **İlgi Bildirimi**: Taleplere ilgi/ilgisizlik bildirimi
- **Not Ekleme**: Talep hakkında not ekleme

### 👨‍💼 Admin Modülü

- **Kullanıcı Yönetimi**: Tüm kullanıcıları görüntüleme ve yönetme
- **Ürün Yönetimi**: Ürün ekleme, düzenleme, silme
- **Sipariş Takibi**: Tüm siparişleri ve tedarikçi ilgilerini görüntüleme
- **Sistem Yönetimi**: Genel sistem durumu ve istatistikler

### 🔧 Teknik Özellikler

- **Next.js 14** (App Router)
- **TypeScript** ile tip güvenliği
- **Material-UI** modern UI framework
- **React Context** state yönetimi
- **JWT Authentication** güvenli kimlik doğrulama
- **Responsive Design** mobil uyumlu tasarım
- **Toast Notifications** kullanıcı bildirimleri

## 📋 Gereksinimler

- Node.js 18+
- npm veya yarn
- Backend API çalışır durumda

## 🛠️ Kurulum

1. **Projeyi klonlayın:**

```bash
git clone <repository-url>
cd packaging-request-management/frontend
```

2. **Bağımlılıkları yükleyin:**

```bash
npm install
# veya
yarn install
```

3. **Environment dosyası oluşturun:**

```bash
# .env.local dosyası oluşturun
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

4. **Uygulamayı başlatın:**

```bash
npm run dev
# veya
yarn dev
```

5. **Tarayıcıda açın:**

```
http://localhost:3000
```

## 🏗️ Proje Yapısı

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router sayfaları
│   │   ├── auth/              # Kimlik doğrulama sayfaları
│   │   ├── customer/          # Müşteri modülü
│   │   ├── admin/             # Admin modülü
│   │   └── supplier/          # Tedarikçi modülü
│   ├── components/            # Yeniden kullanılabilir bileşenler
│   ├── context/               # React Context providers
│   ├── services/              # API servisleri
│   ├── types/                 # TypeScript tip tanımları
│   ├── locales/               # Çoklu dil desteği
│   └── utils/                 # Yardımcı fonksiyonlar
├── public/                    # Statik dosyalar
└── package.json
```

## 🔌 API Bağlantıları

### Backend Endpoints

**Ürünler:**

- `GET /products/active` - Aktif ürünleri listele
- `GET /products/types/active` - Aktif ürün tiplerini listele
- `GET /products/type/:type` - Tip bazlı ürün filtreleme
- `GET /products/:id` - Tek ürün detayı
- `GET /products` - Tüm ürünler (Admin)
- `POST /products` - Yeni ürün oluştur (Admin)
- `PATCH /products/:id` - Ürün güncelle (Admin)
- `PATCH /products/:id/toggle` - Ürün aktif/pasif durumu (Admin)
- `DELETE /products/:id` - Ürün sil (Admin)
- `GET /products/types` - Tüm ürün tipleri (Admin)

**Siparişler:**

- `POST /orders` - Yeni sipariş oluştur
- `GET /orders/my-orders` - Müşterinin siparişlerini listele
- `GET /orders/my-orders/:id` - Sipariş detayı (tedarikçi ilgileri ile)
- `GET /orders/product-type/:type` - Ürün tipine göre siparişler
- `GET /orders` - Tüm siparişler (Admin)
- `GET /orders/with-supplier-interests` - Tüm siparişler tedarikçi ilgileri ile (Admin)
- `GET /orders/with-supplier-interests/:id` - Sipariş detayı tedarikçi ilgileri ile (Admin)
- `GET /orders/by-supplier-interest/:supplierId` - Tedarikçi ilgisine göre siparişler (Admin)
- `GET /orders/customer/:customerId` - Müşteri siparişleri (Admin)
- `GET /orders/:id` - Sipariş detayı (Admin)
- `PATCH /orders/:id` - Sipariş güncelle (Admin)
- `DELETE /orders/:id` - Sipariş sil (Admin)

**Kimlik Doğrulama:**

- `POST /auth/login` - Giriş yap
- `POST /auth/register` - Kayıt ol
- `POST /auth/refresh` - Token yenile
- `GET /auth/profile` - Kullanıcı profili

**Kullanıcılar (Admin):**

- `GET /users` - Tüm kullanıcıları listele
- `GET /users/:id` - Kullanıcı detayı
- `POST /users` - Yeni kullanıcı oluştur
- `PATCH /users/:id` - Kullanıcı güncelle
- `DELETE /users/:id` - Kullanıcı sil

**Tedarikçi İlgileri:**

- `POST /supplier-interests` - Tedarikçi ilgisi oluştur
- `PATCH /supplier-interests/:id` - Tedarikçi ilgisi güncelle
- `GET /supplier-interests/my-interests` - Tedarikçinin ilgileri
- `GET /supplier-interests/orders/by-product-types` - Ürün tipine göre siparişler
- `GET /supplier-interests/orders/:orderId/detail` - Sipariş detayı tedarikçi için
- `POST /supplier-interests/orders/:orderId/toggle-interest` - İlgi durumu değiştir
- `GET /supplier-interests` - Tüm tedarikçi ilgileri (Admin)
- `GET /supplier-interests/order/:orderId` - Sipariş tedarikçi ilgileri
- `GET /supplier-interests/supplier/:supplierId` - Tedarikçi ilgileri (Admin)
- `GET /supplier-interests/:id` - Tedarikçi ilgisi detayı (Admin)
- `DELETE /supplier-interests/:id` - Tedarikçi ilgisi sil (Admin)

## 🎨 UI Bileşenleri

### Ana Bileşenler

- **Header**: Üst navigasyon ve kullanıcı menüsü
- **Sidebar**: Sol menü navigasyonu
- **AuthGuard**: Rol bazlı sayfa koruması
- **Toast**: Bildirim sistemi
- **CartContext**: Sepet yönetimi

### Sayfa Bileşenleri

- **Products Page**: Ürün kataloğu ve filtreleme
- **Orders Page**: Sepet yönetimi ve sipariş oluşturma
- **Request Page**: Talep geçmişi ve tedarikçi ilgileri

## 🔐 Güvenlik

- **JWT Token** tabanlı kimlik doğrulama
- **Role-based Access Control** (RBAC)
- **Protected Routes** ile sayfa koruması
- **Token Refresh** otomatik yenileme

## 🌐 Çoklu Dil Desteği

- Türkçe ve İngilizce dil desteği
- Dinamik dil değiştirme
- Context API ile dil yönetimi

## 📱 Responsive Design

- Mobil uyumlu tasarım
- Tablet ve desktop optimizasyonu
- Material-UI breakpoint sistemi

## 🚀 Deployment

### Vercel (Önerilen)

```bash
npm run build
vercel --prod
```

### Docker

```bash
docker build -t frontend .
docker run -p 3000:3000 frontend
```

## 🧪 Test

```bash
# Unit testler
npm run test

# E2E testler
npm run test:e2e

# Linting
npm run lint
```

## 📝 Geliştirme Notları

### Yeni Sayfa Ekleme

1. `src/app/` altında yeni klasör oluşturun
2. `page.tsx` dosyası ekleyin
3. `AuthGuard` ile koruma ekleyin
4. `Sidebar` menüsüne link ekleyin

### API Servisi Ekleme

1. `src/services/api.ts` dosyasına yeni endpoint ekleyin
2. TypeScript interface'leri `src/types/` altında tanımlayın
3. Error handling ekleyin

### Yeni Bileşen Ekleme

1. `src/components/` altında yeni dosya oluşturun
2. TypeScript props interface'i tanımlayın
3. Material-UI bileşenlerini kullanın

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje Sahibi - [@your-email](mailto:your-email)

Proje Linki: [https://github.com/your-username/packaging-request-management](https://github.com/your-username/packaging-request-management)
