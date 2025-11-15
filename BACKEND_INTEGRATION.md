# Kreatif CV Oluşturucu - Backend Entegrasyon Kılavuzu (v2.0 - Kapsamlı Sürüm)

Bu belge, Kreatif CV Oluşturucu frontend uygulamasını kalıcı bir backend servisine bağlamak için gereken API endpoint'lerini, veri modellerini ve iş mantığını detaylandırmaktadır. Bu kılavuz, backend geliştirme sürecinin temelini oluşturur.

## 0. Başlamadan Önce: Mevcut Durum ve Amaç

Şu an elinizdeki proje, tüm özellikleriyle çalışan, **bağımsız bir frontend uygulamasıdır**. Kullanıcı bilgileri, CV'ler ve diğer veriler, kalıcı bir veritabanı yerine tarayıcının **`localStorage`**'ında saklanmaktadır. Bu, uygulamanın sunucusuz bir şekilde test edilmesini ve tüm kullanıcı arayız akışlarının deneyimlenmesini sağlar.

**Bu kılavuzun amacı, bu `localStorage` tabanlı demo'yu, aşağıda belirtilen API endpoint'lerini uygulayarak gerçek bir veritabanına sahip, çok kullanıcılı bir web uygulamasına dönüştürmektir.**

---

## 1. Lokal Geliştirme Ortamı ve API Anahtarı

Backend'i geliştirirken frontend'i lokal olarak çalıştırmak ve test etmek isteyeceksiniz.

### Kurulum Adımları
1.  Projeyi bir klasöre açın.
2.  Terminalde `npm install` komutu ile bağımlılıkları kurun.
3.  Projenin ana dizininde **`.env.local`** adında bir dosya oluşturun.
4.  Bu dosyanın içine Gemini API anahtarınızı ekleyin:
    ```env
    VITE_API_KEY=BURAYA_GERÇEK_GEMINI_API_ANAHTARINIZI_YAPIŞTIRIN
    ```
5.  `npm run dev` komutu ile geliştirme sunucusunu başlatın.
6.  Tarayıcınızda `http://localhost:5173` (veya terminalde belirtilen port) adresine gidin.

Bu adımlar, frontend'in yapay zeka özelliklerinin (`metin iyileştirme`, `CV'den veri çıkarma`) lokalde çalışmasını sağlayacaktır. Backend'e geçiş yapıldığında bu anahtar backend'e taşınmalıdır.

---

## 2. Genel Prensipler

- **API Tipi:** RESTful API
- **Veri Formatı:** JSON
- **Kimlik Doğrulama:** JWT (JSON Web Tokens). Kullanıcı giriş yaptığında bir token oluşturulur ve sonraki tüm yetkili isteklerde `Authorization: Bearer <token>` başlığı ile gönderilir.
- **API Versiyonlama:** Tüm endpoint'ler `/api/v1/` ön eki ile sunulmalıdır. (Örn: `/api/v1/users/me`)
- **Hata Yönetimi:** API, standart HTTP durum kodları (200, 201, 400, 401, 403, 404, 500) ve açıklayıcı JSON hata mesajları (`{ "error": "Mesaj..." }`) döndürmelidir.

---

## 3. Kritik Güvenlik Maddeleri (ZORUNLU)

Bu maddeler, veri sızıntılarını ve güvenlik zafiyetlerini önlemek için **KESİNLİKLE** uygulanmalıdır.

- **API Anahtarını Gizleme:** Gemini API anahtarı **ASLA** frontend kodunda bırakılmamalıdır. Yapay zeka ile ilgili tüm işlemler (metin iyileştirme, CV ayrıştırma) backend'de yapılmalı ve anahtar sunucu tarafında ortam değişkeni (environment variable) olarak saklanmalıdır. Bu, anahtarınızın çalınmasını engeller.
- **Şifre Hash'leme (Password Hashing):** Şifreler **ASLA** veritabanında düz metin olarak saklanmamalıdır. **bcrypt** gibi adaptif ve "salt" kullanan bir algoritma **ZORUNLUDUR**.
- **İletişim Güvenliği:** Production ortamında frontend ve backend arasındaki tüm iletişim **HTTPS** üzerinden yapılmalıdır.
- **Sunucu Tarafı Doğrulama (Input Validation):** Frontend'den gelen **TÜM** veriler sunucu tarafında yeniden doğrulanmalıdır. Asla istemciye güvenmeyin. Bu, XSS, SQL Injection ve diğer enjeksiyon saldırılarını önler.
- **Yetkilendirme (Authorization):** Bir kullanıcının başka bir kullanıcının verilerine (örneğin CV'lerine) erişemediğinden emin olun. Her istekte, işlem yapılmak istenen kaynağın (CV, profil vb.) o anki kullanıcıya ait olduğu kontrol edilmelidir.

---

## 4. Veri Modelleri (Veritabanı Şeması)

Veritabanı şemalarınız, frontend'deki `types.ts` dosyasında tanımlanan arayüzlerle uyumlu olmalıdır. Ana modeller şunlardır:

### User (Kullanıcı)

```json
{
  "_id": "string", // Veritabanı ID'si (örn: MongoDB ObjectID, UUID)
  "email": "string", // Unique, indexli
  "fullName": "string",
  "password": "string", // Hash'lenmiş (bcrypt)
  "role": "'user' | 'admin'", // Varsayılan: 'user'
  "status": "'active' | 'banned'", // Varsayılan: 'active'
  "joinDate": "ISO8601 Date",
}
```

### CVData (CV Verisi)

```json
{
  "_id": "string",
  "userId": "string", // User modeline referans (_id). Indexli olmalı.
  "title": "string",
  "personalInfo": { "..."},
  "summary": "string",
  "experience": "Experience[]",
  "education": "Education[]",
  "skills": "Skill[]",
  // ... diğer alanlar types.ts'deki gibi
  "createdAt": "ISO8601 Date",
  "lastUpdated": "ISO8601 Date"
}
```

### AdBanner (Reklam Banner'ı)

```json
{
  "_id": "string",
  "imageUrl": "string",
  "linkUrl": "string",
  "placement": "'dashboard' | 'templates'",
  "isActive": "boolean"
}
```

---

## 5. API Endpoints ve Frontend Bağlantıları

### 5.1. Kimlik Doğrulama (`/api/v1/auth`)

- **`POST /register`**
  - **Açıklama:** Yeni kullanıcı kaydı oluşturur.
  - **Frontend Karşılığı:** "Kayıt Ol" sayfasındaki form gönderildiğinde tetiklenir.
  - **Request Body:** `{ "fullName": "string", "email": "string", "password": "string" }`
  - **Response (Success):** `201 Created` - `{ "token": "jwt_token", "user": { ... } }`

- **`POST /login`**
  - **Açıklama:** Kullanıcı girişi yapar ve JWT döndürür. **İş mantığı, kullanıcının `status` alanını kontrol etmeli ve 'banned' ise girişi reddetmelidir.**
  - **Frontend Karşılığı:** "Giriş Yap" sayfasındaki form gönderildiğinde `App.tsx` içerisindeki `handleLogin` fonksiyonu tarafından çağrılır.
  - **Request Body:** `{ "email": "string", "password": "string" }`
  - **Response (Success):** `200 OK` - `{ "token": "jwt_token", "user": { ... } }`
  - **Response (Error):** `403 Forbidden` (Kullanıcı yasaklı).

- **`GET /me`**
  - **Açıklama:** Mevcut token'a sahip kullanıcının bilgilerini döndürür. Sayfa yenilendiğinde oturumu doğrulamak için kullanılır.
  - **Frontend Karşılığı:** Uygulama ilk yüklendiğinde (`App.tsx` içindeki `useEffect`), `localStorage`'da token varsa kullanıcının oturumunu doğrulamak için çağrılır.
  - **Yetki:** Geçerli token.
  - **Response (Success):** `200 OK` - `{ "user": { ... } }` (şifre hariç).

### 5.2. CV Yönetimi (`/api/v1/cvs`)

- **`GET /`**
  - **Açıklama:** Giriş yapmış kullanıcıya ait tüm CV'leri listeler.
  - **Frontend Karşılığı:** Kullanıcı "Kontrol Paneli" (`DashboardPage`) sayfasına girdiğinde çağrılır.
  - **Yetki:** Geçerli token.
  - **Response (Success):** `200 OK` - `[CVData]`.

- **`POST /`**
  - **Açıklama:** Yeni bir CV oluşturur.
  - **Frontend Karşılığı:** `DashboardPage`'de "Yeni CV Oluştur" butonuna tıklandığında veya `CVUploader` ile mevcut bir CV yüklendiğinde (`handleNewCV` fonksiyonu tetiklenir) çağrılır.
  - **Yetki:** Geçerli token.
  - **Request Body:** `CVData` nesnesi.
  - **Response (Success):** `201 Created` - Oluşturulan `CVData` nesnesi.

- **`PUT /:id`**
  - **Açıklama:** Belirtilen ID'ye sahip CV'yi günceller.
  - **Frontend Karşılığı:** `CVEditorPage`'de kullanıcı değişiklik yaptığında (`handleSaveCV` fonksiyonu aracılığıyla, debounced olarak) veya "Bitti" butonuna (`handleSaveAndExit`) tıkladığında çağrılır.
  - **Yetki:** Geçerli token (ve kullanıcının sadece kendi CV'sini düzenlediğinden emin olunmalı).
  - **Request Body:** Güncellenmiş `CVData` alanları.
  - **Response (Success):** `200 OK` - Güncellenmiş `CVData` nesnesi.

- **`DELETE /:id`**
  - **Açıklama:** Belirtilen ID'ye sahip CV'yi siler.
  - **Frontend Karşılığı:** `DashboardPage`'de `handleDeleteCV` fonksiyonu çağrıldığında tetiklenir.
  - **Yetki:** Geçerli token (ve kullanıcının sadece kendi CV'sini sildiğinden emin olunmalı).
  - **Response (Success):** `204 No Content`.

### 5.3. Kullanıcı Profili (`/api/v1/users`)

- **`PUT /me`**
  - **Açıklama:** Giriş yapmış kullanıcının profil bilgilerini günceller.
  - **Frontend Karşılığı:** `ProfileSettingsPage` sayfasında `handleInfoSubmit` ile çağrılır.
  - **Yetki:** Geçerli token.
  - **Request Body:** `{ "fullName": "string", "email": "string" }`.

- **`PUT /me/password`**
  - **Açıklama:** Giriş yapmış kullanıcının şifresini değiştirir.
  - **Frontend Karşılığı:** `ProfileSettingsPage` sayfasında `handlePasswordSubmit` ile çağrılır.
  - **Yetki:** Geçerli token.
  - **Request Body:** `{ "currentPassword": "string", "newPassword": "string" }`.

- **`DELETE /me`**
  - **Açıklama:** Giriş yapmış kullanıcıyı ve ona ait tüm verileri (CV'ler dahil) kalıcı olarak siler.
  - **Frontend Karşılığı:** `ProfileSettingsPage` sayfasındaki `handleDeleteAccount` ile çağrılır.
  - **Yetki:** Geçerli token.

### 5.4. Admin Paneli (`/api/v1/admin`)

Tüm bu endpoint'ler `role: 'admin'` kontrolü ile korunmalıdır.

- **`GET /stats`**: `AdminPage` "Genel Bakış" sekmesi için temel istatistikleri (`toplam kullanıcı`, `toplam CV` vb.) döndürür.
- **`GET /users`**: `AdminPage` "Kullanıcılar" sekmesindeki tabloyu doldurur.
- **`PUT /users/:id`**: `AdminUserModal`'da "Kaydet" butonuna (`handleSave`) tıklandığında çağrılır.
- **`PUT /users/:id/status`**: `AdminUserModal`'da "Yasakla/Yasağı Kaldır" butonuna (`onToggleBan`) tıklandığında çağrılır. Request body: `{ "status": "'active' | 'banned'" }`
- **`DELETE /users/:id`**: `AdminUserModal`'da "Kullanıcıyı Sil" butonuna (`handleDelete`) tıklandığında çağrılır.
- **`GET /ads`**: `AdminPage` "Reklam Yönetimi" sekmesindeki mevcut banner'ları listeler.
- **`POST /ads`**: "Yeni Banner Ekle" formu (`handleAdSubmit`) gönderildiğinde çağrılır.
- **`PUT /ads/:id`**: Mevcut bir banner "Düzenle" modunda kaydedildiğinde (`handleAdSubmit`) çağrılır.
- **`DELETE /ads/:id`**: Bir banner'ın yanındaki silme ikonuna (`onDeleteAd`) tıklandığında çağrılır.

### 5.5. Gemini API Servisleri (`/api/v1/ai`)

Bu endpoint'ler, Gemini API anahtarını güvende tutmak için **backend üzerinden** Gemini API'sine istek yapar.

- **`POST /enhance-text`**
  - **Açıklama:** Verilen metni Gemini ile daha profesyonel hale getirir. `gemini-2.5-flash` modeli hız ve maliyet için uygundur.
  - **Frontend Karşılığı:** `CVEditorPage`'de "AI ile Geliştir" butonuna (`handleEnhance`) tıklandığında çağrılır.
  - **Yetki:** Geçerli token.
  - **Request Body:** `{ "text": "string", "lang": "'tr' | 'en'" }`.
  - **Response:** `{ "enhancedText": "string" }`

- **`POST /parse-cv`**
  - **Açıklama:** Yüklenen dosyadan CV verisi çıkarır. Bu işlem daha karmaşık olduğu için **`gemini-2.5-pro`** modeli önerilir.
  - **Frontend Karşılığı:** `CVUploader` bileşeninde `.pdf` veya `.docx` dosyası yüklendiğinde (`triggerAIParse`) çağrılır.
  - **Yetki:** Geçerli token.
  - **Request Body:** `multipart/form-data` formatında dosya. Backend bu dosyayı metne çevirmeli (PDF/DOCX kütüphaneleri kullanarak) ve metni Gemini'ye göndermelidir.
  - **Response:** `CVData` nesnesinin bir alt kümesi (`Partial<CVData>`).

---

## 6. Geliştirme Yol Haritası (Nereden Başlamalı?)

1.  **Veritabanı ve Proje Kurulumu:**
    -   Seçtiğiniz backend teknolojisi (Node.js/Express, Python/FastAPI, vb.) için projeyi oluşturun.
    -   Veritabanı bağlantısını kurun.
    -   Yukarıdaki veri modellerine göre veritabanı şemalarını/modellerini oluşturun.

2.  **İlk Admin Kullanıcısını Oluşturma (Seeding):**
    -   Veritabanı ilk kez oluşturulurken, `role: 'admin'` olan bir kullanıcıyı manuel olarak ekleyin. Örneğin: `admin@karaelmas.com` / şifre: `Karaelmas.034` (şifreyi **bcrypt** ile hash'leyerek!).

3.  **Kimlik Doğrulama (Authentication) Endpoint'lerini Geliştirin:**
    -   `POST /register`, `POST /login` ve `GET /me` endpoint'lerini yazın. JWT oluşturma ve doğrulama mantığını kurun.
    -   Frontend'in `handleLogin` fonksiyonunu bu API'leri çağıracak şekilde güncelleyerek test edin.

4.  **CV Yönetimi (CRUD) Endpoint'lerini Geliştirin:**
    -   `GET`, `POST`, `PUT`, `DELETE` işlemlerini `/api/v1/cvs` için tamamlayın.
    -   **Her işlemde kullanıcının yetkisini (sadece kendi CV'leri üzerinde işlem yapabilme) kontrol edin.**
    -   Kontrol Paneli ve CV Düzenleyici'nin bu API'lerle konuşmasını sağlayın.

5.  **Diğer Endpoint'leri Geliştirin:**
    -   Kullanıcı profili ve admin paneli endpoint'lerini sırayla tamamlayın.

6.  **Backend'i Dağıtma (Deployment):**
    -   Backend uygulamanızı bir sunucuya (Heroku, Vercel, DigitalOcean vb.) dağıtın.
    -   Frontend uygulamasındaki API isteklerinin bu sunucu adresine yapıldığından emin olun.
    
Bu kılavuz, backend geliştirme sürecini başlatmak için gereken tüm bilgileri sağlamaktadır. Başarılar!
