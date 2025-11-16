# Kreatif CV Oluşturucu - Backend Entegrasyon Kılavuzu (AI için)

**DİKKAT: Bu belge Gemini ve ChatGPT gibi Yapay Zeka (AI) dil modelleri için hazırlanmıştır.** Amacı, mevcut ve tam fonksiyonel bir frontend uygulaması için sıfırdan, uyumlu bir backend oluşturma sürecini yönlendirmektir. Lütfen bu kılavuzu dikkatlice oku ve backend kodunu buradaki spesifikasyonlara göre oluştur.

## 0. Projeye Genel Bakış ve Amaç

Elinizdeki proje, **Kreatif CV Oluşturucu** adında, React tabanlı, **tamamen işlevsel bir frontend uygulamasıdır.** Şu anki haliyle, tüm veriler (kullanıcı bilgileri, CV'ler, ayarlar vb.) kalıcı bir veritabanı yerine tarayıcının **`localStorage`**'ında saklanmaktadır. Bu, uygulamanın sunucusuz olarak test edilmesini ve tüm kullanıcı arayüz akışlarının deneyimlenmesini sağlar.

**Bu kılavuzun amacı, bu `localStorage` tabanlı demoyu, aşağıda belirtilen API endpoint'lerini uygulayarak gerçek bir veritabanına sahip, çok kullanıcılı, güvenli ve ölçeklenebilir bir web uygulamasına dönüştürmektir.**

### Proje Kök Klasör Yapısı

AI olarak, kodlarını oluşturacağın klasör yapısı şu şekildedir:

```
CreativeCv/
├── frontend/         <-- MEVCUT VE TAM OLAN FRONTEND KODLARI BU KLASÖRDE
│   ├── components/
│   ├── hooks/
│   ├── i18n/
│   ├── services/
│   ├── templates/
│   ├── utils/
│   ├── App.tsx
│   ├── index.html
│   └── ... (diğer tüm frontend dosyaları)
│
└── backend/          <-- BU KLASÖR ŞU ANDA BOŞ. TÜM BACKEND KODLARINI
    │                   (sunucu, veritabanı modelleri, controller'lar vb.)
    │                   BU KLASÖRÜN İÇİNE OLUŞTURMALISIN.
    └── (package.json, server.js, models/, routes/ etc.)
```

---

## 1. Frontend Mimarisi ve Dosya Dökümü

Backend'i oluşturmadan önce, etkileşimde olacağın frontend'i çok iyi anlaman gerekiyor. İşte frontend projesinin detaylı dökümü:

### `frontend/` Kök Dizini

-   **`index.html`**: Uygulamanın giriş noktası. TailwindCSS, FontAwesome, Google Fonts, PDF.js ve Mammoth.js gibi harici kütüphaneleri yükler.
-   **`index.tsx`**: React uygulamasını `root` div'ine bağlayan (mount eden) dosya.
-   **`App.tsx`**: **EN ÖNEMLİ BİLEŞEN.** Uygulamanın kalbidir.
    -   **Durum Yönetimi (State Management):** `useState` ve `useEffect` hook'ları ile tüm global durumları yönetir: `page` (hangi sayfanın gösterileceği), `currentUser` (giriş yapmış kullanıcı), `allUsers`, `allCVs` (admin paneli için tüm veriler). **Senin görevin buradaki `localStorage` işlemlerini API çağrıları ile değiştirmek.**
    -   **Yönlendirme (Routing):** `renderPage` fonksiyonu ile hangi sayfa bileşeninin render edileceğine karar verir.
    -   **Ana İş Mantığı:** `handleLogin`, `handleLogout`, `handleSaveCV`, `handleDeleteCV` gibi tüm temel fonksiyonları içerir. Bu fonksiyonlar, backend'deki API endpoint'lerini çağıracak şekilde güncellenmelidir.
-   **`types.ts`**: Uygulamadaki tüm TypeScript arayüzlerini (`User`, `CVData`, `Experience`, `Skill` vb.) barındırır. **Backend'deki veritabanı modellerin BU DOSYAYLA %100 UYUMLU OLMALIDIR.**
-   **`services.ts`**: Yapay zeka (Gemini API) ile ilgili fonksiyonları (`enhanceTextWithAI`, `parseCVWithAI`) içerir. **Bu dosya, backend entegrasyonu sırasında en çok değişecek dosyalardan biridir.** Gemini API çağrıları frontend'den kaldırılıp backend'e taşınacaktır.
-   **`templates.tsx`**: Tüm CV şablonu bileşenlerini tek bir yerden export eder.

### `frontend/components/` Klasörü

-   **`layout/`**:
    -   `Header.tsx`: Üst navigasyon çubuğu. Kullanıcı giriş yapmışsa profil menüsünü, yapmamışsa giriş butonunu gösterir.
    -   `Footer.tsx`: Alt bilgi çubuğu.
-   **`pages/`**: Her biri bir sayfayı temsil eden ana bileşenler.
    -   `HomePage.tsx`: Uygulamanın ana sayfası.
    -   `LoginPage.tsx`: Kullanıcı giriş formu. `onLogin` prop'u ile `App.tsx`'deki `handleLogin`'i tetikler.
    -   `DashboardPage.tsx`: Kullanıcının kendi CV'lerini listelediği, yeni CV oluşturduğu veya sildiği kontrol paneli.
    -   `CVEditorPage.tsx`: **Uygulamanın en karmaşık bileşeni.** CV oluşturma ve düzenleme arayüzü. Formlar, AI metin geliştirme butonu ve canlı önizleme içerir. Değişiklikler yapıldıkça `onSaveCV` prop'u ile `App.tsx`'deki `handleSaveCV`'yi tetikler.
    -   `AdminPage.tsx`: Yönetici paneli. Kullanıcıları, reklamları ve istatistikleri yönetir.
    -   `ProfileSettingsPage.tsx`: Kullanıcının profil bilgilerini ve şifresini güncellediği sayfa.
    -   `TemplatesPage.tsx` & `AboutPage.tsx`: Statik içerik sayfaları.
-   **`ui/`**: Yeniden kullanılabilir küçük arayüz bileşenleri.
    -   `Icon.tsx`: FontAwesome ikonlarını gösterir.
    -   `CVUploader.tsx`: Kullanıcının PDF/DOCX formatındaki CV'sini yüklemesini sağlar, metni çıkarır ve AI ile ayrıştırma için `services.ts`'deki fonksiyonu tetikler.
    -   `AdminUserModal.tsx`: Admin panelinde bir kullanıcıyı düzenlemek için açılan pencere.
-   **`editor/`**:
    -   `CVPreview.tsx`: `CVEditorPage`'de CV'nin canlı önizlemesini gösteren bileşen.

### Diğer Klasörler

-   **`hooks/useDebounce.ts`**: Kullanıcı yazarken sürekli API isteği atmamak için girişi geciktiren bir custom hook. `CVEditorPage`'de otomatik kaydetme için kullanılır.
-   **`i18n/index.ts`**: Çoklu dil (TR/EN) desteği için çeviri metinlerini ve `LanguageContext`'i içerir.
-   **`templates/`**: Her biri farklı bir CV tasarımını temsil eden 10 adet React bileşeni içerir (`MinimalistTemplate.tsx`, `CorporateTemplate.tsx` vb.). Bu bileşenler sadece `CVData` prop'u alıp görselleştirme yaparlar, iş mantığı içermezler.
-   **`utils/`**: Yardımcı fonksiyonlar (`data.ts` içinde varsayılan CV verisi, `uuid.ts` içinde mock ID oluşturucu).

---

## 2. Backend Teknolojileri ve Kurulum

-   **Dil/Platform:** Node.js
-   **Framework:** Express.js
-   **Veritabanı:** MongoDB (Mongoose ODM ile)
-   **Kimlik Doğrulama:** JSON Web Tokens (JWT)
-   **Şifreleme:** bcrypt
-   **Dosya Yükleme (CV Parse için):** multer

**Kurulum Adımları (AI için talimat):**
1.  `CreativeCv/backend/` klasörüne git.
2.  `npm init -y` ile `package.json` oluştur.
3.  Gerekli paketleri kur: `npm install express mongoose jsonwebtoken bcrypt cors dotenv multer`
4.  Geliştirme için: `npm install -D nodemon`
5.  `package.json`'daki `scripts` bölümüne `"start": "node server.js"` ve `"dev": "nodemon server.js"` ekle.
6.  `server.js` (veya `index.js`) adında ana sunucu dosyasını oluştur.
7.  `.env` dosyası oluştur ve içine `MONGO_URI`, `JWT_SECRET` ve `GEMINI_API_KEY` değişkenlerini ekle.

---

## 3. Veritabanı Modelleri (Mongoose Şemaları)

Aşağıdaki Mongoose şemalarını `backend/models/` klasöründe oluştur. Bu şemalar, `frontend/types.ts` ile birebir uyumlu olmalıdır.

### `User.js`

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true }, // Bcrypt ile hash'lenmiş olacak
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'banned'], default: 'active' },
    joinDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
```

### `CV.js`

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

// types.ts'deki tüm alt arayüzleri şema olarak tanımla
const SkillSchema = new Schema({ name: String, level: Number });
const ExperienceSchema = new Schema({ title: String, company: String, location: String, startDate: String, endDate: String, description: String });
// ...diğerleri (Education, Language, Certificate etc.)

const cvSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    personalInfo: {
        fullName: String, email: String, phoneNumber: String, address: String,
        linkedin: String, github: String, website: String, profilePicture: String,
    },
    summary: String,
    experience: [ExperienceSchema],
    education: [{ institution: String, degree: String, fieldOfStudy: String, startDate: String, endDate: String }],
    skills: [SkillSchema],
    languages: [{ name: String, proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native'] } }],
    certificates: [{ name: String, issuer: String, date: String }],
    projects: [{ name: String, description: String, link: String }],
    references: [{ name: String, relation: String, contact: String }],
    hobbies: [{ name: String }],
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CV', cvSchema);
```

### `AdBanner.js` (Admin Paneli için)

```javascript
const mongoose = require('mongoose');
const { Schema } = mongoose;

const adBannerSchema = new Schema({
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, required: true },
    placement: { type: String, enum: ['dashboard', 'templates'], required: true },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('AdBanner', adBannerSchema);
```

---

## 4. Kritik Güvenlik Maddeleri (ZORUNLU)

-   **API Anahtarını Gizle:** Gemini API anahtarı **ASLA** frontend'e gönderilmemelidir. Yapay zeka ile ilgili tüm işlemler backend'de, `.env` dosyasında saklanan `GEMINI_API_KEY` ile yapılmalıdır.
-   **Şifre Hash'leme:** `User` modelini kaydetmeden önce `bcrypt.hash()` kullan. Giriş yaparken `bcrypt.compare()` ile karşılaştır.
-   **Yetkilendirme:** API endpoint'lerini korumak için bir JWT middleware'i yaz. Bu middleware, `Authorization: Bearer <token>` başlığından token'ı alır, doğrular ve `req.user` içine kullanıcı bilgilerini (ID, rol vb.) ekler.
-   **Veri Sahipliği:** Bir kullanıcının CV'sini güncellerken veya silerken (`PUT /api/v1/cvs/:id`), istenen CV'nin `userId`'sinin, token'dan gelen `req.user.id` ile eşleştiğini KESİNLİKLE kontrol et. Bu, başkalarının CV'lerini değiştirmesini engeller.
-   **Admin Rolü Koruması:** Admin endpoint'leri (`/api/v1/admin/*`) için yazdığın middleware, `req.user.role === 'admin'` kontrolü yapmalıdır.
-   **Girdi Doğrulama (Input Validation):** `express-validator` gibi bir kütüphane kullanarak frontend'den gelen tüm verileri (özellikle `req.body`) sunucu tarafında doğrula.

---

## 5. API Endpoint Spesifikasyonları

Tüm endpoint'ler `/api/v1` ön eki ile başlamalıdır.

### 5.1. Kimlik Doğrulama (`/auth`)

-   **`POST /register`**
    -   **Frontend Bağlantısı:** Gelecekte eklenecek "Kayıt Ol" sayfası.
    -   **Açıklama:** Yeni kullanıcı kaydı. Şifreyi hash'le.
    -   **Response:** `{ token, user: { id, fullName, email, role } }`

-   **`POST /login`**
    -   **Frontend Bağlantısı:** `LoginPage.tsx` -> `App.tsx`'deki `handleLogin`.
    -   **Açıklama:** Kullanıcı girişi. `status: 'banned'` ise 403 Forbidden döndür.
    -   **Response:** `{ token, user: { id, fullName, email, role } }`

-   **`GET /me`**
    -   **Frontend Bağlantısı:** `App.tsx`'deki `useEffect` (sayfa yenilendiğinde oturumu doğrulamak için).
    -   **Açıklama:** Token ile kullanıcı bilgilerini getirir.
    -   **Yetki:** User Token.
    -   **Response:** `{ user: { id, fullName, email, role } }`

### 5.2. CV Yönetimi (`/cvs`)

-   **`GET /`**
    -   **Frontend Bağlantısı:** `DashboardPage.tsx`.
    -   **Açıklama:** Giriş yapmış kullanıcıya ait tüm CV'leri listeler.
    -   **Yetki:** User Token.

-   **`POST /`**
    -   **Frontend Bağlantısı:** `DashboardPage.tsx`'deki "Yeni CV" butonu -> `handleNewCV`.
    -   **Açıklama:** Yeni CV oluşturur. `req.user.id`'yi `userId` olarak atar.
    -   **Yetki:** User Token.

-   **`PUT /:id`**
    -   **Frontend Bağlantısı:** `CVEditorPage.tsx` -> `handleSaveCV`.
    -   **Açıklama:** ID'si verilen CV'yi günceller. **Veri sahipliği kontrolü ZORUNLUDUR.**
    -   **Yetki:** User Token.

-   **`DELETE /:id`**
    -   **Frontend Bağlantısı:** `DashboardPage.tsx` -> `handleDeleteCV`.
    -   **Açıklama:** ID'si verilen CV'yi siler. **Veri sahipliği kontrolü ZORUNLUDUR.**
    -   **Yetki:** User Token.

### 5.3. Yapay Zeka Servisleri (`/ai`)

-   **`POST /enhance-text`**
    -   **Frontend Bağlantısı:** `CVEditorPage.tsx`'deki "AI ile Geliştir" butonu -> `services.ts`'deki `enhanceTextWithAI`.
    -   **Açıklama:** Gelen metni Gemini API'ye gönderir ve sonucu döndürür. `GEMINI_API_KEY` backend'de kullanılır.
    -   **Yetki:** User Token.
    -   **Request Body:** `{ text: "...", lang: "tr" }`

-   **`POST /parse-cv`**
    -   **Frontend Bağlantısı:** `CVUploader.tsx` -> `services.ts`'deki `parseCVWithAI`.
    -   **Açıklama:** `multer` ile yüklenen PDF/DOCX dosyasını metne çevirir (sunucuda `pdf-parse`, `mammoth` gibi kütüphaneler kullan), metni yapılandırılmış JSON istemek için Gemini API'ye gönderir.
    -   **Yetki:** User Token.
    -   **Request Body:** `multipart/form-data` formatında dosya.
    -   **Response:** `Partial<CVData>` formatında JSON.

### 5.4. Admin Paneli (`/admin`)

-   **`GET /users`**, **`PUT /users/:id`**, **`DELETE /users/:id`** vb.
    -   **Frontend Bağlantısı:** `AdminPage.tsx` ve `AdminUserModal.tsx`.
    -   **Açıklama:** `BACKEND_INTEGRATION.md` dosyasının eski versiyonunda detaylandırıldığı gibi tüm admin CRUD işlemlerini uygula.
    -   **Yetki:** Admin Token.

---

## 6. Frontend'in Backend'e Bağlanması

Frontend'de `localStorage` kullanan veya doğrudan Gemini API'yi çağıran yerleri, oluşturduğun backend API'sine `fetch` veya `axios` ile istek atacak şekilde güncellemelisin. **Değiştirilmesi gereken ana dosyalar şunlardır:**

### 1. `frontend/services.ts` (En Önemli Değişiklik)

Bu dosyadaki fonksiyonlar, doğrudan Gemini API'yi çağırmak yerine senin oluşturduğun backend'e istek atmalıdır.

**Örnek `enhanceTextWithAI` Değişikliği:**

```typescript
// ESKİ HALİ (Doğrudan Gemini'ye istek)
// import { GoogleGenAI } from "@google/genai";
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
// ...
// const response = await ai.models.generateContent(...);
// return response.text.trim();

// YENİ HALİ (Backend'e istek)
export const enhanceTextWithAI = async (text: string, lang: 'tr' | 'en' = 'tr'): Promise<string> => {
  const token = localStorage.getItem('token'); // Token'ı al
  if (!token) throw new Error("Not authenticated");
  
  const response = await fetch('/api/v1/ai/enhance-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ text, lang })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "AI enhancement failed");
  }

  const data = await response.json();
  return data.enhancedText;
};
```

`parseCVWithAI` fonksiyonu da benzer şekilde, dosyayı `FormData` ile `/api/v1/ai/parse-cv` endpoint'ine gönderecek şekilde güncellenmelidir.

### 2. `frontend/App.tsx`

`localStorage` işlemleri API çağrılarıyla değiştirilmelidir.

-   **`useEffect` (ilk yükleme):** `localStorage`'dan `currentUser` okumak yerine, `token` varsa `/api/v1/auth/me` endpoint'ine istek atarak kullanıcıyı doğrula ve `setCurrentUser` ile state'i güncelle.
-   **`handleLogin`:** `/api/v1/auth/login`'e istek at. Başarılı olursa, dönen `token`'ı `localStorage`'a kaydet ve `user` verisini state'e ata.
-   **`handleLogout`:** `localStorage`'dan `token`'ı sil.
-   **CV Fonksiyonları (`handleSaveCV`, `handleDeleteCV` vb.):** Bu fonksiyonların içindeki `localStorage.setItem` çağrıları, ilgili API endpoint'lerine (`PUT /api/v1/cvs/:id`, `DELETE /api/v1/cvs/:id`) `fetch` çağrıları ile değiştirilmelidir. CV verileri artık `allCVs` state'i için `useEffect` içinde `/api/v1/cvs` endpoint'inden çekilmelidir.

Bu kılavuz, backend geliştirme sürecini başlatmak ve frontend ile tam entegrasyonu sağlamak için gereken tüm bilgileri içermektedir. Başarılar!
