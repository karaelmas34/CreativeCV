
import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import type { Page, CVData, User, Template, AdBanner, Certificate, Project, Hobby, Reference } from './types';
import { enhanceTextWithAI, parseCVWithAI } from './services';
import { 
    MinimalistTemplate, CorporateTemplate, CreativeColumnTemplate, InfographicTemplate, 
    PhotoFocusTemplate, DarkModeTemplate, ColorBlockTemplate, TypographicTemplate, 
    ModernGridTemplate, SidebarNavTemplate 
} from './templates';

// HACK: Make mammoth and pdfjsLib globally available from window
declare const mammoth: any;
declare const pdfjsLib: any;

// --- MOCK UUID ---
const uuidv4_mock = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

// --- I18n (Internationalization) Setup ---
const translations = {
  tr: {
    "header.title": "Kreatif CV",
    "header.home": "Anasayfa",
    "header.templates": "Şablonlar",
    "header.about": "Hakkımızda",
    "header.adminPanel": "Admin Paneli",
    "header.dashboard": "Kontrol Paneli",
    "header.login": "Giriş Yap / Kayıt Ol",
    "header.profileSettings": "Profil Ayarları",
    "header.logout": "Çıkış Yap",
    "footer.copyright": "© {year} Kreatif CV. Tüm hakları saklıdır.",
    "footer.privacy": "Güvenliğiniz bizim için önemlidir. Verileriniz yerel olarak saklanır.",
    "home.title": "Hayalinizdeki CV'yi Yaratın",
    "home.subtitle": "Saniyeler içinde profesyonel, modern ve yaratıcı özgeçmişler oluşturun. Yapay zeka destekli metin iyileştirme ile fark yaratın.",
    "home.cta": "Hemen Başla - Ücretsiz",
    "home.featuredTemplates": "Öne Çıkan Şablonlarımız",
    "home.templatePreview": "Şablon Önizlemesi",
    "home.seeAllTemplates": "Tüm şablonları gör &rarr;",
    "home.featuresTitle": "Neden Kreatif CV?",
    "home.feature1Title": "Yapay Zeka Gücü",
    "home.feature1Desc": "Metinlerinizi saniyeler içinde profesyonel bir dile çevirin. Özet ve iş tanımlarınızı yapay zeka ile güçlendirin, işe alım yöneticilerinin dikkatini çekin.",
    "home.feature2Title": "Göz Alıcı Şablonlar",
    "home.feature2Desc": "Modern, kurumsal veya yaratıcı... Tarzınıza uygun, endüstri standartlarında tasarlanmış 10'dan fazla profesyonel şablon arasından seçim yapın.",
    "home.feature3Title": "Kolay ve Hızlı",
    "home.feature3Desc": "Karmaşık arayüzlere veda edin. Sezgisel düzenleyicimiz ile CV'nizi dakikalar içinde hazırlayın, renklerini özelleştirin ve PDF olarak indirin.",
    "home.howItWorksTitle": "Nasıl Çalışır?",
    "home.step1": "1. Kayıt Olun",
    "home.step1Desc": "Hızlıca ücretsiz bir hesap oluşturun ve tüm özelliklere anında erişin.",
    "home.step2": "2. Şablon Seçin",
    "home.step2Desc": "Kişiliğinizi ve profesyonelliğinizi yansıtan mükemmel şablonu bulun.",
    "home.step3": "3. Bilgilerinizi Girin",
    "home.step3Desc": "Yapay zeka yardımıyla bilgilerinizi doldurun veya mevcut CV'nizi yükleyin.",
    "home.step4": "4. İndirin!",
    "home.step4Desc": "CV'nizi yüksek kalitede PDF olarak anında indirin ve başvurulara başlayın.",
    "login.title": "Hesabınıza Giriş Yapın",
    "login.emailPlaceholder": "Email adresi",
    "login.passwordPlaceholder": "Şifre",
    "login.demoInfo": "Demo admin: admin@karaelmas.com, şifre: Karaelmas.034. Diğer kullanıcılar için herhangi bir bilgiyle giriş yapabilirsiniz.",
    "login.cta": "Giriş Yap",
    "login.signUpPrompt": "Hesabınız yok mu?",
    "login.signUpLink": "Kayıt Olun",
    "login.forgotPassword": "Şifrenizi mi unuttunuz?",
    "login.banned": "Bu hesap askıya alınmıştır. Lütfen yönetici ile iletişime geçin.",
    "about.title": "Hakkımızda",
    "about.missionTitle": "Misyonumuz: Kariyer Fırsatlarını Herkese Açmak",
    "about.missionText": "Profesyonel ve iyi tasarlanmış bir CV'nin bir lüks olmaması gerektiğine inanıyoruz. Misyonumuz, herkesin potansiyelini gerçekten yansıtan ve yeni fırsatların kapılarını aralayan bir CV oluşturmasına yardımcı olmak için güçlü, kullanımı kolay ve tamamen ücretsiz araçlar sunmaktır.",
    "about.freeTitle": "Her Zaman Ücretsiz",
    "about.freeText": "Evet, doğru duydunuz. Kreatif CV'nin tüm temel özellikleri tamamen ücretsizdir ve her zaman öyle kalacaktır. Gizli maliyetler, premium'a özel şablonlar veya filigranlar yok. Sadece kariyer yolculuğunuzu desteklemek için yüksek kaliteli bir araç.",
    "about.valuesTitle": "Değerlerimiz",
    "about.value1Title": "Tasarım Mükemmelliği",
    "about.value1Desc": "Şablonlarımız, harika bir ilk izlenim bırakmanızı sağlamak için profesyonel tasarımcılar tarafından özenle hazırlanmıştır.",
    "about.value2Title": "Yapay Zeka Gücü",
    "about.value2Desc": "Daha etkili ve profesyonel içerikler yazmanıza yardımcı olmak için en son yapay zeka teknolojilerinden yararlanıyoruz.",
    "about.value3Title": "Kullanıcı Gizliliği",
    "about.value3Desc": "Verileriniz size aittir. Tarayıcınızda yerel olarak saklanır ve asla satılmaz. Gizliliğiniz bizim için esastır.",
    "about.cta": "Kariyerinize Şimdi Yön Verin",
    "dashboard.title": "Kontrol Paneli",
    "dashboard.newCV": "Yeni CV Oluştur",
    "dashboard.welcome": "Hoş geldin, {0}! CV'lerini buradan yönetebilirsin.",
    "dashboard.noCVs": "Henüz hiç CV oluşturmadınız.",
    "dashboard.createFirstCV": "İlk CV'nizi Oluşturun",
    "dashboard.lastUpdated": "Son güncelleme: {0}",
    "dashboard.edit": "Düzenle",
    "dashboard.importCV": "Veya Mevcut CV'nizi Yükleyin",
    "dashboard.importDropzone": "CV'nizi (.pdf, .docx) buraya sürükleyin veya dosyayı seçin",
    "dashboard.importParsing": "CV'niz yapay zeka tarafından okunuyor... Lütfen bekleyin.",
    "dashboard.importError": "CV okunurken bir hata oluştu.",
    "templates.title": "CV Şablonları",
    "admin.title": "Admin Paneli",
    "admin.dashboard": "Genel Bakış",
    "admin.users": "Kullanıcılar",
    "admin.ads": "Reklam Yönetimi",
    "admin.totalUsers": "Toplam Kullanıcı",
    "admin.totalCVs": "Oluşturulan CV Sayısı",
    "admin.dailyVisitors": "Günlük Ziyaretçi",
    "admin.activeUsers": "Aktif Kullanıcı",
    "admin.newUsersToday": "Bugün Üye Olanlar",
    "admin.cvsCreatedToday": "Bugün Oluşturulan CV'ler",
    "admin.userList": "Kullanıcı Listesi",
    "admin.email": "Email",
    "admin.cvCount": "CV Sayısı",
    "admin.joinDate": "Katılım Tarihi",
    "admin.status": "Durum",
    "admin.status.active": "Aktif",
    "admin.status.banned": "Yasaklı",
    "admin.searchUser": "Kullanıcı adı veya email ile ara...",
    "admin.editUser": "Kullanıcıyı Düzenle",
    "admin.banUser": "Kullanıcıyı Yasakla",
    "admin.unbanUser": "Yasağı Kaldır",
    "admin.deleteUser": "Kullanıcıyı Sil",
    "admin.deleteUserConfirm": "{0} adlı kullanıcıyı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
    "admin.ads.title": "Reklam Yönetimi",
    "admin.ads.new": "Yeni Banner Ekle",
    "admin.ads.imageUrl": "Resim URL",
    "admin.ads.linkUrl": "Bağlantı URL",
    "admin.ads.placement": "Yerleşim",
    "admin.ads.isActive": "Aktif",
    "admin.ads.save": "Kaydet",
    "admin.ads.current": "Mevcut Bannerlar",
    "admin.ads.actions": "Eylemler",
    "profile.title": "Profil Ayarları",
    "profile.updateInfo": "Bilgileri Güncelle",
    "profile.infoUpdated": "Profil bilgileri başarıyla güncellendi.",
    "profile.changePassword": "Şifre Değiştir",
    "profile.currentPassword": "Mevcut Şifre",
    "profile.newPassword": "Yeni Şifre",
    "profile.confirmNewPassword": "Yeni Şifreyi Onayla",
    "profile.passwordUpdated": "Şifre başarıyla değiştirildi.",
    "profile.passwordMismatch": "Yeni şifreler eşleşmiyor.",
    "profile.dangerZone": "Tehlikeli Alan",
    "profile.deleteAccount": "Hesabımı Sil",
    "profile.deleteAccountInfo": "Bu işlem geri alınamaz. Tüm CV'leriniz ve kişisel verileriniz kalıcı olarak silinecektir.",
    "profile.deleteConfirm": "Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
    "editor.title": "CV Düzenleyici",
    "editor.done": "Bitti",
    "editor.download": "İndir",
    "editor.autosave": "Değişiklikleriniz otomatik olarak kaydedildi.",
    "editor.selectTemplate": "Şablon Seç",
    "editor.primaryColor": "Ana Renk",
    "editor.personalInfo": "Kişisel Bilgiler",
    "editor.fullName": "Tam Ad",
    "editor.email": "Email",
    "editor.phoneNumber": "Telefon Numarası",
    "editor.address": "Adres",
    "editor.linkedin": "LinkedIn",
    "editor.github": "GitHub",
    "editor.website": "Web Sitesi",
    "editor.profilePicture": "Profil Fotoğrafı",
    "editor.changeImage": "Değiştir",
    "editor.profilePictureUrl": "Veya Resim URL'si",
    "editor.summary": "Özet",
    "editor.summaryPlaceholder": "Profesyonel özet",
    "editor.enhanceWithAI": "AI ile Geliştir",
    "editor.enhancing": "İyileştiriliyor...",
    "editor.experience": "Deneyim",
    "editor.jobTitle": "Ünvan",
    "editor.company": "Şirket",
    "editor.location": "Konum",
    "editor.startDate": "Başlangıç Tarihi",
    "editor.endDate": "Bitiş Tarihi",
    "editor.present": "Halen çalışıyorum",
    "editor.description": "Açıklama",
    "editor.remove": "Kaldır",
    "editor.addExperience": "Deneyim Ekle",
    "editor.education": "Eğitim",
    "editor.addEducation": "Eğitim Ekle",
    "editor.institution": "Okul / Kurum Adı",
    "editor.degree": "Bölüm / Derece",
    "editor.fieldOfStudy": "Alan",
    "editor.skills": "Yetenekler",
    "editor.addSkill": "Yetenek Ekle",
    "editor.skillName": "Yetenek Adı",
    "editor.skillLevel": "Seviye",
    "editor.languages": "Diller",
    "editor.addLanguage": "Dil Ekle",
    "editor.languageName": "Dil",
    "editor.proficiency": "Yeterlilik",
    "editor.addSection": "Bölüm Ekle",
    "editor.certificates": "Sertifikalar",
    "editor.projects": "Projeler",
    "editor.references": "Referanslar",
    "editor.hobbies": "Hobiler & İlgi Alanları",
    "editor.addCertificate": "Sertifika Ekle",
    "editor.certificateName": "Sertifika Adı",
    "editor.issuer": "Veren Kurum",
    "editor.date": "Tarih",
    "editor.addProject": "Proje Ekle",
    "editor.projectName": "Proje Adı",
    "editor.projectLink": "Proje Linki",
    "editor.addReference": "Referans Ekle",
    "editor.referenceName": "Referans Adı",
    "editor.relation": "İlişki / Ünvan",
    "editor.contactInfo": "İletişim Bilgisi",
    "editor.addHobby": "Hobi Ekle",
    "editor.hobbyName": "Hobi / İlgi Alanı",
    "editor.deleteConfirm": "Bu CV'yi silmek istediğinizden emin misiniz?",
    "editor.desktopPreview": "Masaüstü Görünümü",
    "editor.mobilePreview": "Mobil Görünümü",
    "editor.undo": "Geri Al",
    "editor.redo": "İleri Al",
    "editor.downloadAd.title": "İndirmeden Önce Son Bir Adım",
    "editor.downloadAd.body": "Ücretsiz hizmetimizin devamlılığı için kısa bir reklam izleyerek bize destek olabilirsiniz. Anlayışınız için teşekkür ederiz.",
    "editor.downloadAd.confirm": "Reklamı İzle ve İndir",
    "editor.downloadAd.cancel": "Vazgeç",
    "editor.ad.title": "Reklam",
    "editor.ad.closeAfter": "Reklamı {0} saniye sonra kapatabilirsiniz.",
    "editor.ad.closeNow": "Reklamı Kapat",
    "editor.previewCV": "CV'yi Önizle",
    "editor.backToEditor": "Düzenleyiciye Dön",
    "template.minimalist": "Minimalist",
    "template.corporate": "Kurumsal",
    "template.creative-column": "Yaratıcı Sütun",
    "template.infographic": "İnfografik",
    "template.photo-focus": "Fotoğraf Odaklı",
    "template.dark-mode": "Karanlık Mod",
    "template.color-block": "Renk Bloğu",
    "template.typographic": "Tipografik",
    "template.modern-grid": "Modern Izgara",
    "template.sidebar-nav": "Kenar Çubuğu",
  },
  en: {
    "header.title": "Creative CV",
    "header.home": "Home",
    "header.templates": "Templates",
    "header.about": "About Us",
    "header.adminPanel": "Admin Panel",
    "header.dashboard": "Dashboard",
    "header.login": "Login / Sign Up",
    "header.profileSettings": "Profile Settings",
    "header.logout": "Logout",
    "footer.copyright": "© {year} Creative CV. All rights reserved.",
    "footer.privacy": "Your security is important to us. Your data is stored locally.",
    "home.title": "Create Your Dream CV",
    "home.subtitle": "Create professional, modern, and creative resumes in seconds. Make a difference with AI-powered text enhancement.",
    "home.cta": "Get Started - It's Free",
    "home.featuredTemplates": "Our Featured Templates",
    "home.templatePreview": "Template Preview",
    "home.seeAllTemplates": "See all templates &rarr;",
    "home.featuresTitle": "Why Creative CV?",
    "home.feature1Title": "AI Power",
    "home.feature1Desc": "Transform your text into professional language in seconds. Enhance your summary and job descriptions with AI to catch the recruiter's eye.",
    "home.feature2Title": "Stunning Templates",
    "home.feature2Desc": "Modern, corporate, or creative... Choose from over 10 professional, industry-standard templates that fit your style.",
    "home.feature3Title": "Easy and Fast",
    "home.feature3Desc": "Say goodbye to complex interfaces. Prepare your CV, customize its colors, and download it as a PDF in minutes with our intuitive editor.",
    "home.howItWorksTitle": "How It Works?",
    "home.step1": "1. Sign Up",
    "home.step1Desc": "Quickly create a free account and get instant access to all features.",
    "home.step2": "2. Choose a Template",
    "home.step2Desc": "Find the perfect template that reflects your personality and professionalism.",
    "home.step3": "3. Fill in Your Info",
    "home.step3Desc": "Fill in your information with AI assistance or upload your existing CV.",
    "home.step4": "4. Download!",
    "home.step4Desc": "Instantly download your CV in high-quality PDF and start applying.",
    "login.title": "Login to Your Account",
    "login.emailPlaceholder": "Email address",
    "login.passwordPlaceholder": "Password",
    "login.demoInfo": "Demo admin: admin@karaelmas.com, pass: Karaelmas.034. For other users, you can log in with any credentials.",
    "login.cta": "Login",
    "login.signUpPrompt": "Don't have an account?",
    "login.signUpLink": "Sign Up",
    "login.forgotPassword": "Forgot your password?",
    "login.banned": "This account has been suspended. Please contact an administrator.",
    "about.title": "About Us",
    "about.missionTitle": "Our Mission: Unlocking Career Opportunities for Everyone",
    "about.missionText": "We believe that a professional, well-designed CV shouldn't be a luxury. Our mission is to provide powerful, easy-to-use, and completely free tools to help everyone create a CV that truly reflects their potential and opens doors to new opportunities.",
    "about.freeTitle": "Always Free",
    "about.freeText": "That's right. All core features of Creative CV are, and always will be, completely free. No hidden costs, no premium-only templates, no watermarks. Just a high-quality tool to support your career journey.",
    "about.valuesTitle": "Our Values",
    "about.value1Title": "Design Excellence",
    "about.value1Desc": "Our templates are crafted by professional designers to ensure you make a great first impression.",
    "about.value2Title": "AI Power",
    "about.value2Desc": "We leverage cutting-edge AI to help you write more effective and professional content.",
    "about.value3Title": "User Privacy",
    "about.value3Desc": "Your data is yours. It's stored locally in your browser, and we don't sell it. Your privacy is paramount.",
    "about.cta": "Shape Your Career Now",
    "dashboard.title": "Dashboard",
    "dashboard.newCV": "Create New CV",
    "dashboard.welcome": "Welcome, {0}! You can manage your CVs here.",
    "dashboard.noCVs": "You haven't created any CVs yet.",
    "dashboard.createFirstCV": "Create Your First CV",
    "dashboard.lastUpdated": "Last updated: {0}",
    "dashboard.edit": "Edit",
    "dashboard.importCV": "Or Upload Your Existing CV",
    "dashboard.importDropzone": "Drag & drop your CV (.pdf, .docx) here, or click to select file",
    "dashboard.importParsing": "Parsing your CV with AI... Please wait.",
    "dashboard.importError": "An error occurred while parsing the CV.",
    "templates.title": "CV Templates",
    "admin.title": "Admin Panel",
    "admin.dashboard": "Dashboard",
    "admin.users": "Users",
    "admin.ads": "Ad Management",
    "admin.totalUsers": "Total Users",
    "admin.totalCVs": "CVs Created",
    "admin.dailyVisitors": "Daily Visitors",
    "admin.activeUsers": "Active Users",
    "admin.newUsersToday": "New Users Today",
    "admin.cvsCreatedToday": "CVs Created Today",
    "admin.userList": "User List",
    "admin.email": "Email",
    "admin.cvCount": "CV Count",
    "admin.joinDate": "Join Date",
    "admin.status": "Status",
    "admin.status.active": "Active",
    "admin.status.banned": "Banned",
    "admin.searchUser": "Search by user name or email...",
    "admin.editUser": "Edit User",
    "admin.banUser": "Ban User",
    "admin.unbanUser": "Unban User",
    "admin.deleteUser": "Delete User",
    "admin.deleteUserConfirm": "Are you sure you want to permanently delete the user {0}? This action cannot be undone.",
    "admin.ads.title": "Ad Management",
    "admin.ads.new": "Add New Banner",
    "admin.ads.imageUrl": "Image URL",
    "admin.ads.linkUrl": "Link URL",
    "admin.ads.placement": "Placement",
    "admin.ads.isActive": "Active",
    "admin.ads.save": "Save",
    "admin.ads.current": "Current Banners",
    "admin.ads.actions": "Actions",
    "profile.title": "Profile Settings",
    "profile.updateInfo": "Update Information",
    "profile.infoUpdated": "Profile information updated successfully.",
    "profile.changePassword": "Change Password",
    "profile.currentPassword": "Current Password",
    "profile.newPassword": "New Password",
    "profile.confirmNewPassword": "Confirm New Password",
    "profile.passwordUpdated": "Password changed successfully.",
    "profile.passwordMismatch": "New passwords do not match.",
    "profile.dangerZone": "Danger Zone",
    "profile.deleteAccount": "Delete My Account",
    "profile.deleteAccountInfo": "This action cannot be undone. All your CVs and personal data will be permanently deleted.",
    "profile.deleteConfirm": "Are you sure you want to delete your account? This action cannot be undone.",
    "editor.title": "CV Editor",
    "editor.done": "Done",
    "editor.download": "Download",
    "editor.autosave": "Your changes have been saved automatically.",
    "editor.selectTemplate": "Select Template",
    "editor.primaryColor": "Primary Color",
    "editor.personalInfo": "Personal Information",
    "editor.fullName": "Full Name",
    "editor.email": "Email",
    "editor.phoneNumber": "Phone Number",
    "editor.address": "Address",
    "editor.linkedin": "LinkedIn",
    "editor.github": "GitHub",
    "editor.website": "Website",
    "editor.profilePicture": "Profile Picture",
    "editor.changeImage": "Change",
    "editor.profilePictureUrl": "Or Image URL",
    "editor.summary": "Summary",
    "editor.summaryPlaceholder": "Professional summary",
    "editor.enhanceWithAI": "Enhance with AI",
    "editor.enhancing": "Enhancing...",
    "editor.experience": "Experience",
    "editor.jobTitle": "Job Title",
    "editor.company": "Company",
    "editor.location": "Location",
    "editor.startDate": "Start Date",
    "editor.endDate": "End Date",
    "editor.present": "I currently work here",
    "editor.description": "Description",
    "editor.remove": "Remove",
    "editor.addExperience": "Add Experience",
    "editor.education": "Education",
    "editor.addEducation": "Add Education",
    "editor.institution": "Institution Name",
    "editor.degree": "Degree / Major",
    "editor.fieldOfStudy": "Field of Study",
    "editor.skills": "Skills",
    "editor.addSkill": "Add Skill",
    "editor.skillName": "Skill Name",
    "editor.skillLevel": "Level",
    "editor.languages": "Languages",
    "editor.addLanguage": "Add Language",
    "editor.languageName": "Language",
    "editor.proficiency": "Proficiency",
    "editor.addSection": "Add Section",
    "editor.certificates": "Certificates",
    "editor.projects": "Projects",
    "editor.references": "References",
    "editor.hobbies": "Hobbies & Interests",
    "editor.addCertificate": "Add Certificate",
    "editor.certificateName": "Certificate Name",
    "editor.issuer": "Issuing Organization",
    "editor.date": "Date",
    "editor.addProject": "Add Project",
    "editor.projectName": "Project Name",
    "editor.projectLink": "Project Link",
    "editor.addReference": "Add Reference",
    "editor.referenceName": "Reference Name",
    "editor.relation": "Relation / Title",
    "editor.contactInfo": "Contact Information",
    "editor.addHobby": "Add Hobby",
    "editor.hobbyName": "Hobby / Interest",
    "editor.deleteConfirm": "Are you sure you want to delete this CV?",
    "editor.desktopPreview": "Desktop View",
    "editor.mobilePreview": "Mobile View",
    "editor.undo": "Undo",
    "editor.redo": "Redo",
    "editor.downloadAd.title": "One Last Step Before Downloading",
    "editor.downloadAd.body": "You can support us by watching a short ad to ensure the continuity of our free service. Thank you for your understanding.",
    "editor.downloadAd.confirm": "Watch Ad and Download",
    "editor.downloadAd.cancel": "Cancel",
    "editor.ad.title": "Advertisement",
    "editor.ad.closeAfter": "You can close the ad in {0} seconds.",
    "editor.ad.closeNow": "Close Ad",
    "editor.previewCV": "Preview CV",
    "editor.backToEditor": "Back to Editor",
    "template.minimalist": "Minimalist",
    "template.corporate": "Corporate",
    "template.creative-column": "Creative Column",
    "template.infographic": "Infographic",
    "template.photo-focus": "Photo Focus",
    "template.dark-mode": "Dark Mode",
    "template.color-block": "Color Block",
    "template.typographic": "Typographic",
    "template.modern-grid": "Modern Grid",
    "template.sidebar-nav": "Sidebar Nav",
  }
};
type AppLanguage = keyof typeof translations;
type TranslationKey = keyof typeof translations['en'];

const getInitialLanguage = (): AppLanguage => {
  const browserLang = navigator.language.split('-')[0] as AppLanguage;
  return translations[browserLang] ? browserLang : 'en';
};

const LanguageContext = createContext({
  language: 'en' as AppLanguage,
  setLanguage: (lang: AppLanguage) => {},
  t: (key: TranslationKey, ...args: (string | number)[]) => key as string
});

const useTranslations = () => useContext(LanguageContext);

const getInitialCVData = (t: (key: TranslationKey, ...args: any[]) => string, userEmail: string): CVData => ({
    id: uuidv4_mock(),
    userEmail: userEmail,
    title: t('editor.fullName') + ' CV',
    personalInfo: {
        fullName: t('editor.fullName'),
        email: 'email@example.com',
        phoneNumber: '+90 555 123 4567',
        address: 'City, Country',
        linkedin: '', github: '', website: '',
        profilePicture: 'https://picsum.photos/200'
    },
    summary: t('home.subtitle'),
    experience: [{ id: uuidv4_mock(), title: 'Software Developer', company: 'Tech Inc.', location: 'Istanbul', startDate: '2022-01', endDate: 'Present', description: 'Developed modern web applications using React and TypeScript. Worked within the team to improve code quality.' }],
    education: [{ id: uuidv4_mock(), institution: 'University Name', degree: 'Bachelor', fieldOfStudy: 'Computer Engineering', startDate: '2018-09', endDate: '2022-06' }],
    skills: [{id: uuidv4_mock(), name: 'React', level: 4}, {id: uuidv4_mock(), name: 'TypeScript', level: 4}, {id: uuidv4_mock(), name: 'Node.js', level: 3}],
    languages: [{id: uuidv4_mock(), name: 'English', proficiency: 'Advanced'}],
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
});

// --- Custom Hooks ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}


// --- Components ---
const Icon: React.FC<{ icon: string; className?: string, style?: React.CSSProperties }> = ({ icon, className, style }) => (
  <i className={`${icon} ${className}`} style={style}></i>
);

const UserProfileDropdown: React.FC<{ user: User; setPage: (page: Page) => void; onLogout: () => void; }> = ({ user, setPage, onLogout }) => {
    const { t } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleNavigation = (page: Page) => {
        setPage(page);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const userInitials = user.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-dark-card"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {userInitials}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-light-card dark:bg-dark-card rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fadeIn" role="menu" aria-orientation="vertical">
                    <div className="py-1" role="none">
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                            <p className="font-semibold truncate">{user.fullName}</p>
                            <p className="truncate text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                        <a onClick={() => handleNavigation('dashboard')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" role="menuitem">{t('header.dashboard')}</a>
                        <a onClick={() => handleNavigation('profile')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" role="menuitem">{t('header.profileSettings')}</a>
                        {user.role === 'admin' && (
                            <a onClick={() => handleNavigation('admin')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" role="menuitem">{t('header.adminPanel')}</a>
                        )}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        <a onClick={() => { onLogout(); setIsOpen(false); }} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer" role="menuitem">{t('header.logout')}</a>
                    </div>
                </div>
            )}
        </div>
    );
};

const Header: React.FC<{ user: User | null; setPage: (page: Page) => void; onLogout: () => void; }> = ({ user, setPage, onLogout }) => {
    const { t, language, setLanguage } = useTranslations();
    
    return (
        <header className="bg-light-card dark:bg-dark-card shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div className="text-2xl font-bold text-primary cursor-pointer" onClick={() => setPage('home')}>
                    <Icon icon="fa-solid fa-file-signature" className="mr-2" />
                    {t('header.title')}
                </div>
                <div className="flex-1 flex justify-center items-center space-x-6">
                    <a onClick={() => setPage('home')} className="hidden md:inline cursor-pointer hover:text-primary transition">{t('header.home')}</a>
                    <a onClick={() => setPage('templates')} className="hidden md:inline cursor-pointer hover:text-primary transition">{t('header.templates')}</a>
                    <a onClick={() => setPage('about')} className="hidden md:inline cursor-pointer hover:text-primary transition">{t('header.about')}</a>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as AppLanguage)}
                            className="appearance-none bg-transparent cursor-pointer hover:text-primary transition p-2"
                        >
                            <option value="tr">🇹🇷 TR</option>
                            <option value="en">🇺🇸 EN</option>
                        </select>
                    </div>
                    {user ? (
                        <UserProfileDropdown user={user} setPage={setPage} onLogout={onLogout} />
                    ) : (
                        <button onClick={() => setPage('login')} className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition">{t('header.login')}</button>
                    )}
                </div>
            </nav>
        </header>
    );
};

const Footer: React.FC = () => {
    const { t } = useTranslations();
    return (
        <footer className="bg-light-card dark:bg-dark-card mt-12 py-8">
            <div className="container mx-auto px-6 text-center text-gray-500 dark:text-gray-400">
                <p>{t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}</p>
                <p className="text-sm mt-2">{t('footer.privacy')}</p>
            </div>
        </footer>
    );
};

const HomePage: React.FC<{ setPage: (page: Page) => void, templates: Template[] }> = ({ setPage, templates }) => {
    const { t } = useTranslations();
    const initialCVData = getInitialCVData(t, 'preview@example.com');
    const features = [
        { icon: 'fa-solid fa-wand-magic-sparkles', title: t('home.feature1Title'), desc: t('home.feature1Desc') },
        { icon: 'fa-solid fa-palette', title: t('home.feature2Title'), desc: t('home.feature2Desc') },
        { icon: 'fa-solid fa-rocket', title: t('home.feature3Title'), desc: t('home.feature3Desc') }
    ];
    const steps = [
        { title: t('home.step1'), desc: t('home.step1Desc') },
        { title: t('home.step2'), desc: t('home.step2Desc') },
        { title: t('home.step3'), desc: t('home.step3Desc') },
        { title: t('home.step4'), desc: t('home.step4Desc') },
    ];

    return (
    <div className="container mx-auto px-6 py-12">
        <div className="text-center animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                {t('home.title')}
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                {t('home.subtitle')}
            </p>
            <button onClick={() => setPage('login')} className="mt-10 px-8 py-4 bg-primary text-white font-bold rounded-full text-lg transform hover:scale-105 transition-transform duration-300 shadow-lg">
                {t('home.cta')}
            </button>
        </div>

        <div className="mt-24 py-16">
            <h2 className="text-4xl font-bold text-center mb-12">{t('home.featuresTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {features.map(feature => (
                    <div key={feature.title}>
                        <Icon icon={feature.icon} className="text-5xl mb-4 text-secondary" />
                        <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-16 py-16 bg-light-card dark:bg-dark-card rounded-xl">
             <h2 className="text-4xl font-bold text-center mb-12">{t('home.howItWorksTitle')}</h2>
             <div className="relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
                     {steps.map((step, index) => (
                        <div key={step.title} className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4 z-10">{index + 1}</div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 px-4">{step.desc}</p>
                        </div>
                     ))}
                </div>
             </div>
        </div>

        <div className="mt-24">
            <h2 className="text-4xl font-bold text-center mb-12">{t('home.featuredTemplates')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.slice(0, 3).map(template => (
                    <div key={template.id} className="bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 group" onClick={() => setPage('templates')}>
                        <div className="aspect-[1/1.414] w-full bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden relative">
                            <div className="absolute inset-0 transform scale-[0.35] origin-top-left bg-white">
                                <template.component cvData={initialCVData} />
                            </div>
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-center font-bold text-lg bg-black/50 px-4 py-2 rounded">
                                   {t(template.name as TranslationKey)}
                                </span>
                            </div>
                        </div>
                        <h3 className="mt-4 font-semibold text-lg text-center">{t(template.name as TranslationKey)}</h3>
                    </div>
                ))}
            </div>
            <div className="text-center">
                <button onClick={() => setPage('templates')} className="mt-12 text-primary hover:underline font-semibold">{t('home.seeAllTemplates')}</button>
            </div>
        </div>
    </div>
)};

const LoginPage: React.FC<{ onLogin: (data: { email: string; role: 'user' | 'admin', joinDate: string }) => void; setPage: (page: Page) => void }> = ({ onLogin, setPage }) => {
    const { t } = useTranslations();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const isAdmin = email === 'admin@karaelmas.com' && password === 'Karaelmas.034';
        const role = isAdmin ? 'admin' : 'user';
        onLogin({ email, role, joinDate: new Date().toISOString() });
    };

    return (
        <div className="flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-light-card dark:bg-dark-card rounded-xl shadow-lg animate-fadeIn">
                <h2 className="text-3xl font-bold text-center">{t('login.title')}</h2>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-transparent focus:border-primary focus:ring-primary" placeholder={t('login.emailPlaceholder')} />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Şifre</label>
                        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 border-transparent focus:border-primary focus:ring-primary" placeholder={t('login.passwordPlaceholder')} />
                    </div>
                    <div className="text-sm text-right">
                        <a href="#" onClick={(e) => { e.preventDefault(); alert('Bu özellik yakında eklenecektir.'); }} className="font-medium text-primary hover:underline">{t('login.forgotPassword')}</a>
                    </div>
                    <p className="text-xs text-center text-gray-500">{t('login.demoInfo')}</p>
                    <button type="submit" className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary/90 transition">{t('login.cta')}</button>
                </form>
                <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                    {t('login.signUpPrompt')}{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Bu özellik yakında eklenecektir.'); }} className="font-medium text-primary hover:underline">{t('login.signUpLink')}</a>
                </div>
            </div>
        </div>
    );
};

const AboutPage: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
    const { t } = useTranslations();
    const values = [
        { icon: 'fa-solid fa-palette', title: t('about.value1Title'), desc: t('about.value1Desc') },
        { icon: 'fa-solid fa-wand-magic-sparkles', title: t('about.value2Title'), desc: t('about.value2Desc') },
        { icon: 'fa-solid fa-shield-halved', title: t('about.value3Title'), desc: t('about.value3Desc') }
    ];

    return (
        <div className="container mx-auto px-6 py-16 animate-fadeIn">
            <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold font-display text-primary">
                    {t('about.title')}
                </h1>
            </div>

            <div className="mt-16 max-w-4xl mx-auto space-y-12">
                <div className="bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-4 text-center">{t('about.missionTitle')}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                        {t('about.missionText')}
                    </p>
                </div>

                <div className="bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold mb-4 text-center text-secondary">{t('about.freeTitle')}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                        {t('about.freeText')}
                    </p>
                </div>
                
                <div className="py-12">
                     <h2 className="text-4xl font-bold text-center mb-12">{t('about.valuesTitle')}</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                         {values.map(value => (
                             <div key={value.title}>
                                 <Icon icon={value.icon} className="text-5xl mb-4 text-primary" />
                                 <h3 className="text-2xl font-bold mb-2">{value.title}</h3>
                                 <p className="text-gray-600 dark:text-gray-300">{value.desc}</p>
                             </div>
                         ))}
                     </div>
                </div>

                <div className="text-center mt-8">
                     <button onClick={() => setPage('login')} className="px-8 py-4 bg-primary text-white font-bold rounded-full text-lg transform hover:scale-105 transition-transform duration-300 shadow-lg">
                         {t('about.cta')}
                     </button>
                </div>
            </div>
        </div>
    );
};

const CVUploader: React.FC<{ onCVParseSuccess: (data: Partial<CVData>) => void, userEmail: string }> = ({ onCVParseSuccess, userEmail }) => {
    const { t } = useTranslations();
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = async (file: File) => {
        if (!file) return;
        setIsParsing(true);
        setError(null);
        try {
            if (file.type === 'application/pdf') {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
                    const pdf = await pdfjsLib.getDocument(typedArray).promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        fullText += content.items.map((item: any) => item.str).join(' ');
                    }
                    triggerAIParse(fullText);
                };
                reader.readAsArrayBuffer(file);
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = result.value;
                    
                    const text = tempDiv.innerText || tempDiv.textContent || '';
                    
                    const imgElement = tempDiv.querySelector('img');
                    const imgSrc = imgElement ? imgElement.src : null;
                    
                    triggerAIParse(text, imgSrc);
                };
                reader.readAsArrayBuffer(file);
            } else {
                throw new Error('Unsupported file type');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setIsParsing(false);
        }
    };
    
    const triggerAIParse = async (text: string, imgSrc: string | null = null) => {
        try {
            const parsedData = await parseCVWithAI(text);
            
            if (imgSrc) {
                if (!parsedData.personalInfo) {
                    parsedData.personalInfo = {
                        fullName: '', email: '', phoneNumber: '', address: '',
                        linkedin: '', github: '', website: '', profilePicture: ''
                    };
                }
                parsedData.personalInfo.profilePicture = imgSrc;
            }

            onCVParseSuccess(parsedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsParsing(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };

    return (
        <div className="mt-10">
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-light-bg dark:bg-dark-bg px-2 text-sm text-gray-500">{t('dashboard.importCV')}</span>
                </div>
            </div>
            <div 
              className={`mt-4 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-600 hover:border-primary'}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                {isParsing ? (
                    <div>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-sm text-gray-500">{t('dashboard.importParsing')}</p>
                    </div>
                ) : (
                    <div>
                        <Icon icon="fa-solid fa-cloud-arrow-up" className="text-4xl text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">{t('dashboard.importDropzone')}</p>
                    </div>
                )}
                {error && <p className="mt-2 text-sm text-red-500">{t('dashboard.importError')} {error}</p>}
            </div>
        </div>
    );
};


const DashboardPage: React.FC<{
    user: User;
    cvs: CVData[];
    adBanners: AdBanner[];
    setPage: (page: Page) => void;
    onNewCV: (userEmail: string, initialData?: Partial<CVData>) => void;
    onEditCV: (id: string) => void;
    onDeleteCV: (id: string) => void;
}> = ({ user, cvs, adBanners, setPage, onNewCV, onEditCV, onDeleteCV }) => {
    const { t, language } = useTranslations();

    const handleCVParseSuccess = (data: Partial<CVData>) => {
        onNewCV(user.email, data);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString(language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const AdBannerComponent: React.FC<{banners: AdBanner[]}> = ({banners}) => {
        const activeBanner = banners.find(b => b.placement === 'dashboard' && b.isActive);
        if (!activeBanner) return null;
        return (
            <div className="mt-10 p-4 bg-gray-100 dark:bg-dark-card rounded-lg text-center">
                <a href={activeBanner.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={activeBanner.imageUrl} alt="Advertisement" className="mx-auto rounded max-h-40"/>
                </a>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
                <button onClick={() => onNewCV(user.email)} className="px-5 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition flex items-center gap-2">
                    <Icon icon="fa-solid fa-plus" /> {t('dashboard.newCV')}
                </button>
            </div>
            <p className="mb-8 text-lg">{t('dashboard.welcome', user.fullName)}</p>
            {cvs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cvs.map(cv => (
                        <div key={cv.id} className="bg-light-card dark:bg-dark-card rounded-lg shadow-md p-6 flex flex-col justify-between animate-fadeIn">
                            <div>
                                <h3 className="text-xl font-bold truncate">{cv.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.lastUpdated', formatDate(cv.lastUpdated))}</p>
                            </div>
                            <div className="mt-6 flex space-x-3">
                                <button onClick={() => onEditCV(cv.id)} className="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition">{t('dashboard.edit')}</button>
                                <button onClick={() => onDeleteCV(cv.id)} className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition"><Icon icon="fa-solid fa-trash" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <p className="text-xl text-gray-500">{t('dashboard.noCVs')}</p>
                    <button onClick={() => onNewCV(user.email)} className="mt-4 px-6 py-3 bg-primary text-white rounded-md">{t('dashboard.createFirstCV')}</button>
                </div>
            )}
             <CVUploader onCVParseSuccess={handleCVParseSuccess} userEmail={user.email} />
             <AdBannerComponent banners={adBanners} />
        </div>
    );
};

const TemplatesPage: React.FC<{ setPage: (page: Page) => void; templates: Template[] }> = ({ setPage, templates }) => {
    const { t } = useTranslations();
    const initialCVData = getInitialCVData(t, 'preview@example.com');
    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-center mb-12">{t('templates.title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {templates.map(template => (
                    <div key={template.id} className="bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform duration-300" onClick={() => setPage('login')}>
                        <div className="aspect-[1/1.414] w-full bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                           <template.component cvData={initialCVData} />
                        </div>
                        <h3 className="mt-4 font-semibold text-lg text-center">{t(template.name as TranslationKey)}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminUserModal: React.FC<{
    user: User;
    onClose: () => void;
    onSave: (updatedUser: User) => void;
    onDelete: (email: string) => void;
    onToggleBan: (email: string) => void;
}> = ({ user, onClose, onSave, onDelete, onToggleBan }) => {
    const { t } = useTranslations();
    const [userData, setUserData] = useState(user);

    const handleSave = () => {
        onSave(userData);
        onClose();
    };
    
    const handleDelete = () => {
        if(window.confirm(t('admin.deleteUserConfirm', user.fullName))) {
            onDelete(user.email);
            onClose();
        }
    }

    const inputClass = "w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary";

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl p-8 max-w-lg w-full animate-fadeIn" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{t('admin.editUser')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">&times;</button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('editor.fullName')}</label>
                        <input value={userData.fullName} onChange={e => setUserData({...userData, fullName: e.target.value})} className={inputClass}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t('editor.email')}</label>
                        <input type="email" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} className={inputClass}/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.status')}</label>
                        <p className={`px-3 py-1 inline-block text-sm rounded-full ${userData.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                           {t(userData.status === 'active' ? 'admin.status.active' : 'admin.status.banned')}
                        </p>
                    </div>
                </div>
                
                <div className="mt-8 flex flex-wrap justify-between gap-4">
                    <div>
                         <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">{t('admin.ads.save')}</button>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => onToggleBan(user.email)} className={`px-4 py-2 text-white rounded-md ${user.status === 'active' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}>
                            {user.status === 'active' ? t('admin.banUser') : t('admin.unbanUser')}
                        </button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">{t('admin.deleteUser')}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const AdminPage: React.FC<{
    allUsers: User[];
    allCVs: CVData[];
    adBanners: AdBanner[];
    onAddAd: (ad: Omit<AdBanner, 'id'>) => void;
    onUpdateAd: (ad: AdBanner) => void;
    onDeleteAd: (id: string) => void;
    onSelectUser: (user: User) => void;
}> = ({ allUsers, allCVs, adBanners, onAddAd, onUpdateAd, onDeleteAd, onSelectUser }) => {
    const { t, language } = useTranslations();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'ads'>('dashboard');
    const [userSearch, setUserSearch] = useState('');

    const [adForm, setAdForm] = useState<Omit<AdBanner, 'id'>>({
        imageUrl: '',
        linkUrl: 'https://',
        placement: 'dashboard',
        isActive: true,
    });
    const [editingAdId, setEditingAdId] = useState<string | null>(null);

    // --- MOCKED STATS ---
    const isToday = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };
    
    const dailyVisitors = Math.floor(Math.random() * (allUsers.length * 2)) + allUsers.length;
    const activeUsers = Math.floor(Math.random() * (allUsers.length * 0.2)) + Math.floor(allUsers.length * 0.8); // At least 80%
    const newUsersToday = allUsers.filter(u => isToday(u.joinDate)).length;
    const cvsCreatedToday = allCVs.filter(cv => isToday(cv.createdAt)).length;
    
    const StatCard: React.FC<{title: string; value: string | number; icon: string; color: string;}> = ({title, value, icon, color}) => (
        <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                <Icon icon={icon} className="text-white text-xl" />
            </div>
            <div>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">{title}</h2>
                <p className="text-3xl font-bold mt-1">{value}</p>
            </div>
        </div>
    );
    // --- END MOCKED STATS ---

    const handleAdFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setAdForm(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleAdSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAdId) {
            onUpdateAd({ id: editingAdId, ...adForm });
            setEditingAdId(null);
        } else {
            onAddAd(adForm);
        }
        setAdForm({ imageUrl: '', linkUrl: 'https://', placement: 'dashboard', isActive: true });
    };

    const handleEditAd = (ad: AdBanner) => {
        setEditingAdId(ad.id);
        setAdForm({ ...ad });
    };
    
    const handleCancelEdit = () => {
        setEditingAdId(null);
        setAdForm({ imageUrl: '', linkUrl: 'https://', placement: 'dashboard', isActive: true });
    }

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(language);
    
    const tabs = [
        { id: 'dashboard', label: t('admin.dashboard'), icon: 'fa-solid fa-chart-line' },
        { id: 'users', label: t('admin.users'), icon: 'fa-solid fa-users' },
        { id: 'ads', label: t('admin.ads'), icon: 'fa-solid fa-rectangle-ad' },
    ];

    const filteredUsers = allUsers.filter(user =>
        user.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    return (
        <div className="container mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-4">{t('admin.title')}</h1>
            
            <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`${ activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300' } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm`}>
                            <Icon icon={tab.icon} className="-ml-0.5 mr-2 h-5 w-5" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            
            {activeTab === 'dashboard' && (
                <div className="animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title={t('admin.dailyVisitors')} value={dailyVisitors} icon="fa-solid fa-eye" color="bg-blue-500"/>
                        <StatCard title={t('admin.activeUsers')} value={activeUsers} icon="fa-solid fa-user-check" color="bg-green-500"/>
                        <StatCard title={t('admin.newUsersToday')} value={newUsersToday} icon="fa-solid fa-user-plus" color="bg-yellow-500"/>
                        <StatCard title={t('admin.cvsCreatedToday')} value={cvsCreatedToday} icon="fa-solid fa-file-circle-plus" color="bg-purple-500"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">{t('admin.totalUsers')}</h2>
                            <p className="text-4xl font-bold mt-2 text-primary">{allUsers.length}</p>
                        </div>
                        <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">{t('admin.totalCVs')}</h2>
                            <p className="text-4xl font-bold mt-2 text-secondary">{allCVs.length}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'users' && (
                 <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-md overflow-hidden animate-fadeIn">
                    <div className="p-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{t('admin.userList')}</h2>
                        <input
                            type="text"
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            placeholder={t('admin.searchUser')}
                            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-transparent focus:border-primary focus:ring-primary w-full max-w-xs"
                        />
                    </div>
                    <table className="min-w-full">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('editor.fullName')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('admin.email')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('admin.status')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('admin.cvCount')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('admin.joinDate')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map(user => (
                                <tr key={user.email} onClick={() => onSelectUser(user)} className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap">{user.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {t(user.status === 'active' ? 'admin.status.active' : 'admin.status.banned')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{allCVs.filter(cv => cv.userEmail === user.email).length}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(user.joinDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
             {activeTab === 'ads' && (
                <div className="animate-fadeIn">
                    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md mb-8">
                         <h2 className="text-2xl font-bold mb-4">{editingAdId ? 'Banner Düzenle' : t('admin.ads.new')}</h2>
                         <form onSubmit={handleAdSubmit} className="space-y-4">
                            <input name="imageUrl" value={adForm.imageUrl} onChange={handleAdFormChange} placeholder={t('admin.ads.imageUrl')} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600" required />
                            <input name="linkUrl" value={adForm.linkUrl} onChange={handleAdFormChange} placeholder={t('admin.ads.linkUrl')} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600" required />
                            <select name="placement" value={adForm.placement} onChange={handleAdFormChange} className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                                <option value="dashboard">Dashboard</option>
                                <option value="templates">Templates Page</option>
                            </select>
                            <label className="flex items-center gap-2"><input type="checkbox" name="isActive" checked={adForm.isActive} onChange={handleAdFormChange} /> {t('admin.ads.isActive')}</label>
                            <div className="flex gap-2">
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">{t('admin.ads.save')}</button>
                                {editingAdId && <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-300 text-black rounded">İptal</button>}
                            </div>
                         </form>
                    </div>

                    <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">{t('admin.ads.current')}</h2>
                        <div className="space-y-4">
                            {adBanners.map(ad => (
                                <div key={ad.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                                    <div className="flex items-center gap-4">
                                        <img src={ad.imageUrl} className="w-24 h-12 object-contain bg-gray-200" alt="banner"/>
                                        <div>
                                            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">{ad.linkUrl}</a>
                                            <p className="text-sm text-gray-500">{ad.placement} - {ad.isActive ? "Aktif" : "Pasif"}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditAd(ad)} className="p-2 text-blue-600 hover:text-blue-800"><Icon icon="fa-solid fa-pencil"/></button>
                                        <button onClick={() => onDeleteAd(ad.id)} className="p-2 text-red-600 hover:text-red-800"><Icon icon="fa-solid fa-trash"/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
             )}
        </div>
    );
};

const ProfileSettingsPage: React.FC<{
    user: User;
    onUpdate: (updatedUser: User) => void;
    onDelete: () => void;
}> = ({ user, onUpdate, onDelete }) => {
    const { t } = useTranslations();
    const [infoData, setInfoData] = useState({
        fullName: user.fullName,
        email: user.email,
    });
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const inputClass = "w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary";

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInfoData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({ ...user, ...infoData });
        alert(t('profile.infoUpdated'));
    };
    
    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new.length < 6) {
            alert("Şifre en az 6 karakter olmalı."); // Add to translations if needed
            return;
        }
        if (passwordData.new !== passwordData.confirm) {
            alert(t('profile.passwordMismatch'));
            return;
        }
        // In a real app, this would be an API call with current password validation
        alert(t('profile.passwordUpdated'));
        setPasswordData({ current: '', new: '', confirm: '' });
    };

    const handleDeleteAccount = () => {
        if (window.confirm(t('profile.deleteConfirm'))) {
            onDelete();
        }
    };

    return (
        <div className="container mx-auto px-6 py-10 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">{t('profile.title')}</h1>
            <div className="space-y-12">
                {/* Profile Information */}
                <div className="bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">{t('editor.personalInfo')}</h2>
                    <form onSubmit={handleInfoSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium mb-1">{t('editor.fullName')}</label>
                            <input id="fullName" name="fullName" type="text" value={infoData.fullName} onChange={handleInfoChange} className={inputClass} required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">{t('editor.email')}</label>
                            <input id="email" name="email" type="email" value={infoData.email} onChange={handleInfoChange} className={inputClass} required />
                        </div>
                        <div className="text-right">
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">{t('profile.updateInfo')}</button>
                        </div>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">{t('profile.changePassword')}</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="current" className="block text-sm font-medium mb-1">{t('profile.currentPassword')}</label>
                            <input id="current" name="current" type="password" value={passwordData.current} onChange={handlePasswordChange} className={inputClass} required />
                        </div>
                        <div>
                            <label htmlFor="new" className="block text-sm font-medium mb-1">{t('profile.newPassword')}</label>
                            <input id="new" name="new" type="password" value={passwordData.new} onChange={handlePasswordChange} className={inputClass} required />
                        </div>
                        <div>
                            <label htmlFor="confirm" className="block text-sm font-medium mb-1">{t('profile.confirmNewPassword')}</label>
                            <input id="confirm" name="confirm" type="password" value={passwordData.confirm} onChange={handlePasswordChange} className={inputClass} required />
                        </div>
                         <div className="text-right">
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">{t('profile.changePassword')}</button>
                        </div>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-lg border border-red-300 dark:border-red-700">
                    <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">{t('profile.dangerZone')}</h2>
                    <p className="mt-2 text-sm text-red-600 dark:text-red-200">{t('profile.deleteAccountInfo')}</p>
                    <div className="mt-4">
                        <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">{t('profile.deleteAccount')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CVPreview = React.memo(({ cvData, primaryColor, templates, selectedTemplate, previewMode }: {
    cvData: CVData,
    primaryColor: string,
    templates: Template[],
    selectedTemplate: string,
    previewMode: 'desktop' | 'mobile'
}) => {
    const cvPreviewRef = useRef<HTMLDivElement>(null);
    const debouncedCvData = useDebounce(cvData, 500);
    const TemplateComponent = templates.find(t => t.id === selectedTemplate)?.component;

    // This effect handles the print logic and needs access to the debounced data
    useEffect(() => {
        const handlePrint = () => {
             const printContent = cvPreviewRef.current;
             if (printContent) {
                const printWindow = window.open('', '', 'height=800,width=800');
                if (printWindow) {
                    printWindow.document.write('<html><head><title>CV</title>');
                    printWindow.document.write('<script src="https://cdn.tailwindcss.com"><\/script>');
                    printWindow.document.write('<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">');
                    printWindow.document.write('<style>@media print { body { -webkit-print-color-adjust: exact; } } .a4-container { width: 210mm; min-height: 297mm; } </style>');
                    printWindow.document.write('</head><body>');
                    printWindow.document.write('<div class="a4-container">');
                    printWindow.document.write(printContent.innerHTML);
                    printWindow.document.write('</div>');
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    setTimeout(() => {
                        printWindow.print();
                        printWindow.close();
                    }, 500);
                }
            }
        };

        window.addEventListener('execute-print', handlePrint);
        return () => window.removeEventListener('execute-print', handlePrint);
    }, []); // This effect runs once to set up the listener

    return (
        <main className="flex-1 h-full w-full overflow-y-auto bg-gray-200 dark:bg-gray-900 p-4 md:p-8 flex items-start justify-center">
            <div 
              ref={cvPreviewRef} 
              className={`mx-auto shadow-2xl transition-all duration-500 ease-in-out transform-gpu 
                ${previewMode === 'desktop' 
                    ? 'w-[210mm] min-h-[297mm]' 
                    : 'w-[375px] h-[667px] rounded-[30px] border-[10px] border-gray-800 dark:border-gray-600 overflow-y-auto'
                }`}
            >
                {TemplateComponent && <TemplateComponent cvData={debouncedCvData} primaryColor={primaryColor} />}
            </div>
        </main>
    );
});


const CVEditorPage: React.FC<{
    activeCV: CVData;
    onSaveCV: (cv: CVData) => void;
    setPage: (page: Page) => void;
    templates: Template[];
}> = ({ activeCV, onSaveCV, setPage, templates }) => {
    const { t, language } = useTranslations();
    const [cvData, setCVData] = useState(activeCV);
    const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0].id);
    const [primaryColor, setPrimaryColor] = useState('#4f46e5');
    const [enhancingField, setEnhancingField] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [openSections, setOpenSections] = useState<string[]>(['personalInfo', 'summary', 'education', 'experience', 'skills', 'languages']);
    const profilePicInputRef = useRef<HTMLInputElement>(null);
    const [adFlowState, setAdFlowState] = useState<'idle' | 'pre-ad' | 'ad-running'>('idle');
    const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');

    const toggleSection = (section: string) => {
        setOpenSections(prev => 
            prev.includes(section) 
                ? prev.filter(s => s !== section) 
                : [...prev, section]
        );
    };

    const handleSaveAndExit = () => {
        onSaveCV(cvData);
        setPage('dashboard');
    };

    const executePrint = () => {
        window.dispatchEvent(new CustomEvent('execute-print'));
    };
    
    const startDownloadFlow = () => {
        setAdFlowState('pre-ad');
    };
    
    const handleAdWatched = () => {
        setAdFlowState('idle');
        executePrint();
    }

    const handleEnhance = async (field: 'summary' | `experience.${number}.description`, index?: number) => {
        const fieldKey = field as string;
        setEnhancingField(fieldKey);
        try {
            let textToEnhance = '';
            if (field === 'summary') {
                textToEnhance = cvData.summary;
            } else if (typeof index === 'number') {
                textToEnhance = cvData.experience[index].description;
            }
            
            const enhancedText = await enhanceTextWithAI(textToEnhance, language);

            if (field === 'summary') {
                setCVData(prev => ({ ...prev, summary: enhancedText }));
            } else if (typeof index === 'number') {
                setCVData(prev => {
                    const newExperience = [...prev.experience];
                    newExperience[index] = { ...newExperience[index], description: enhancedText };
                    return { ...prev, experience: newExperience };
                });
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.");
        } finally {
            setEnhancingField(null);
        }
    };

    const handleInputChange = (section: keyof CVData, key: string, value: any, index?: number) => {
        setCVData(prev => {
            const newData = {...prev};
            if(index !== undefined && Array.isArray(newData[section as keyof CVData])) {
                const arr = [...(newData[section as keyof CVData] as any[])];
                arr[index] = {...arr[index], [key]: value};
                return {...newData, [section]: arr};
            } else if (typeof newData[section as keyof CVData] === 'object' && newData[section as keyof CVData] !== null) {
                 return {...newData, [section]: {...(newData[section as keyof CVData] as object), [key]: value}};
            } else {
                 return {...newData, [key as keyof CVData]: value};
            }
        });
    }

    type SectionNames = 'experience' | 'education' | 'skills' | 'languages' | 'certificates' | 'projects' | 'references' | 'hobbies';

    const handleAddItem = (section: SectionNames) => {
        const newItem: any = { id: uuidv4_mock() };
        switch (section) {
            case 'experience': newItem.title = ''; newItem.company = ''; newItem.location=''; newItem.startDate=''; newItem.endDate=''; newItem.description=''; break;
            case 'education': newItem.institution = ''; newItem.degree = ''; newItem.fieldOfStudy=''; newItem.startDate=''; newItem.endDate=''; break;
            case 'skills': newItem.name = ''; newItem.level = 3; break;
            case 'languages': newItem.name = ''; newItem.proficiency = 'Intermediate'; break;
            case 'certificates': newItem.name = ''; newItem.issuer = ''; newItem.date = ''; break;
            case 'projects': newItem.name = ''; newItem.description = ''; newItem.link = ''; break;
            case 'references': newItem.name = ''; newItem.relation = ''; newItem.contact = ''; break;
            case 'hobbies': newItem.name = ''; break;
        }
        setCVData(prev => ({...prev, [section]: [...(prev[section] || []), newItem]}));
    }

    const handleRemoveItem = (section: SectionNames, index: number) => {
        setCVData(prev => ({...prev, [section]: (prev[section] as any[])?.filter((_, i) => i !== index)}));
    }

    const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleInputChange('personalInfo', 'profilePicture', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const availableSections: { [key in Exclude<SectionNames, 'experience' | 'education' | 'skills' | 'languages'>]: TranslationKey } = {
        certificates: "editor.certificates",
        projects: "editor.projects",
        references: "editor.references",
        hobbies: "editor.hobbies",
    };
    type AvailableSectionKey = keyof typeof availableSections;
    
    const unaddedSections = Object.keys(availableSections)
        .filter(key => !cvData.hasOwnProperty(key));
        
    const handleAddSection = (sectionKey: AvailableSectionKey) => {
        if (!cvData.hasOwnProperty(sectionKey)) {
            setCVData(prev => ({
                ...prev,
                [sectionKey]: []
            }));
            setOpenSections(prev => [...prev, sectionKey]);
        }
    };


    const Section: React.FC<{title: string, id: string, children: React.ReactNode, onAdd?: () => void, addLabel?: string}> = ({title, id, children, onAdd, addLabel}) => (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <button onClick={() => toggleSection(id)} className="w-full flex justify-between items-center text-left py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md px-2">
                <h3 className="text-lg font-semibold">{title}</h3>
                <Icon icon={`fa-solid fa-chevron-${openSections.includes(id) ? 'up' : 'down'}`} className="transition-transform"/>
            </button>
            {openSections.includes(id) && (
                <div className="pt-4 px-2 animate-fadeIn space-y-4">
                    {children}
                    {onAdd && addLabel && (
                        <button onClick={onAdd} className="mt-2 text-sm text-secondary hover:text-secondary/80 font-semibold">
                            <Icon icon="fa-solid fa-plus-circle" className="mr-1"/> {addLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
    
    const inputClass = "w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary";

    const PreAdModal = () => (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl p-8 max-w-md w-full text-center animate-fadeIn">
                <Icon icon="fa-solid fa-shield-heart" className="text-4xl text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{t('editor.downloadAd.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{t('editor.downloadAd.body')}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setAdFlowState('idle')} className="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition">{t('editor.downloadAd.cancel')}</button>
                    <button onClick={() => setAdFlowState('ad-running')} className="px-6 py-2 rounded-md bg-secondary text-white hover:bg-secondary/90 transition">{t('editor.downloadAd.confirm')}</button>
                </div>
            </div>
        </div>
    );

    const AdModal = ({ onAdWatched }: {onAdWatched: () => void}) => {
        const [countdown, setCountdown] = useState(5);

        useEffect(() => {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
                return () => clearTimeout(timer);
            }
        }, [countdown]);

        return (
             <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                <div className="bg-black rounded-lg shadow-xl p-4 max-w-2xl w-full text-white animate-fadeIn relative">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold">{t('editor.ad.title')}</h3>
                         {countdown > 0 ? (
                            <span className="text-sm text-gray-400">{t('editor.ad.closeAfter', countdown)}</span>
                         ) : (
                            <button onClick={onAdWatched} className="text-sm hover:text-gray-300">&times; {t('editor.ad.closeNow')}</button>
                         )}
                    </div>
                    <div className="aspect-video bg-gray-800 flex items-center justify-center">
                        <img src="https://picsum.photos/seed/ad/600/337" alt="Advertisement" className="w-full h-full object-cover"/>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-65px)]">
            {adFlowState === 'pre-ad' && <PreAdModal />}
            {adFlowState === 'ad-running' && <AdModal onAdWatched={handleAdWatched} />}
            
            <aside className={`w-full md:w-[450px] flex-shrink-0 h-full bg-light-card dark:bg-dark-card shadow-lg ${mobileView === 'preview' ? 'hidden md:block' : 'block'}`}>
                <div className="h-full overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{t('editor.title')}</h2>
                        <div className="flex items-center gap-2">
                            <button onClick={handleSaveAndExit} className="px-4 py-2 bg-primary text-white rounded-md">{t('editor.done')}</button>
                            <button onClick={startDownloadFlow} className="px-4 py-2 bg-secondary text-white rounded-md">{t('editor.download')}</button>
                        </div>
                    </div>

                    <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-md p-1 mb-6">
                        <button onClick={() => setPreviewMode('desktop')} title={t('editor.desktopPreview')} className={`w-1/2 px-3 py-1 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300'}`} aria-label={t('editor.desktopPreview')}>
                            <Icon icon="fa-solid fa-desktop" className="mr-2" /> {t('editor.desktopPreview')}
                        </button>
                        <button onClick={() => setPreviewMode('mobile')} title={t('editor.mobilePreview')} className={`w-1/2 px-3 py-1 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300'}`} aria-label={t('editor.mobilePreview')}>
                            <Icon icon="fa-solid fa-mobile-screen-button" className="mr-2" /> {t('editor.mobilePreview')}
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="font-semibold">{t('editor.selectTemplate')}</label>
                            <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} className={inputClass}>
                                {templates.map(temp => <option key={temp.id} value={temp.id}>{t(temp.name as TranslationKey)}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="font-semibold">{t('editor.primaryColor')}</label>
                            <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-full mt-1 p-1 h-10"/>
                        </div>

                        <Section title={t('editor.personalInfo')} id="personalInfo">
                            <input value={cvData.personalInfo.fullName} onChange={e => handleInputChange('personalInfo', 'fullName', e.target.value)} placeholder={t('editor.fullName')} className={inputClass}/>
                            <input value={cvData.personalInfo.email} onChange={e => handleInputChange('personalInfo', 'email', e.target.value)} placeholder={t('editor.email')} className={inputClass}/>
                            <input value={cvData.personalInfo.phoneNumber} onChange={e => handleInputChange('personalInfo', 'phoneNumber', e.target.value)} placeholder={t('editor.phoneNumber')} className={inputClass}/>
                            <input value={cvData.personalInfo.address} onChange={e => handleInputChange('personalInfo', 'address', e.target.value)} placeholder={t('editor.address')} className={inputClass}/>
                            <input value={cvData.personalInfo.linkedin} onChange={e => handleInputChange('personalInfo', 'linkedin', e.target.value)} placeholder={t('editor.linkedin')} className={inputClass}/>
                            <input value={cvData.personalInfo.github} onChange={e => handleInputChange('personalInfo', 'github', e.target.value)} placeholder={t('editor.github')} className={inputClass}/>
                            <input value={cvData.personalInfo.website} onChange={e => handleInputChange('personalInfo', 'website', e.target.value)} placeholder={t('editor.website')} className={inputClass}/>
                            <div>
                                <label className="text-sm font-medium">{t('editor.profilePicture')}</label>
                                <div className="flex items-center gap-4 mt-1">
                                    <img 
                                        src={cvData.personalInfo.profilePicture || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} 
                                        alt="Profile" 
                                        className="w-16 h-16 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
                                    />
                                    <div className="flex-grow space-y-2">
                                        <input 
                                            type="file" 
                                            ref={profilePicInputRef} 
                                            className="hidden" 
                                            accept="image/png, image/jpeg, image/webp" 
                                            onChange={handleProfilePictureUpload}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => profilePicInputRef.current?.click()}
                                            className="w-full px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                        >
                                            {t('editor.changeImage')}
                                        </button>
                                        <input 
                                            value={cvData.personalInfo.profilePicture.startsWith('data:') ? '' : cvData.personalInfo.profilePicture} 
                                            onChange={e => handleInputChange('personalInfo', 'profilePicture', e.target.value)} 
                                            placeholder={t('editor.profilePictureUrl')} 
                                            className={`${inputClass}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title={t('editor.summary')} id="summary">
                            <textarea value={cvData.summary} onChange={e => setCVData(prev => ({ ...prev, summary: e.target.value }))} placeholder={t('editor.summaryPlaceholder')} rows={5} className={inputClass}/>
                            <button onClick={() => handleEnhance('summary')} disabled={!!enhancingField} className="mt-2 text-sm text-primary disabled:text-gray-400">
                                {enhancingField === 'summary' ? t('editor.enhancing') : <><Icon icon="fa-solid fa-wand-magic-sparkles"/> {t('editor.enhanceWithAI')}</>}
                            </button>
                        </Section>

                        <Section title={t('editor.education')} id="education" onAdd={() => handleAddItem('education')} addLabel={t('editor.addEducation')}>
                        {cvData.education.map((edu, index) => (
                                <div key={edu.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                    <input value={edu.institution} onChange={e => handleInputChange('education', 'institution', e.target.value, index)} placeholder={t('editor.institution')} className={inputClass}/>
                                    <input value={edu.degree} onChange={e => handleInputChange('education', 'degree', e.target.value, index)} placeholder={t('editor.degree')} className={inputClass}/>
                                    <input value={edu.fieldOfStudy} onChange={e => handleInputChange('education', 'fieldOfStudy', e.target.value, index)} placeholder={t('editor.fieldOfStudy')} className={inputClass}/>
                                    <div className="flex gap-2">
                                        <input type="month" value={edu.startDate} onChange={e => handleInputChange('education', 'startDate', e.target.value, index)} placeholder={t('editor.startDate')} className={inputClass}/>
                                        <input type="month" value={edu.endDate} onChange={e => handleInputChange('education', 'endDate', e.target.value, index)} placeholder={t('editor.endDate')} className={inputClass}/>
                                    </div>
                                    <div className="text-right">
                                        <button onClick={() => handleRemoveItem('education', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                    </div>
                                </div>
                            ))}
                        </Section>

                        <Section title={t('editor.experience')} id="experience" onAdd={() => handleAddItem('experience')} addLabel={t('editor.addExperience')}>
                            {cvData.experience.map((exp, index) => (
                                <div key={exp.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                    <input value={exp.title} onChange={e => handleInputChange('experience', 'title', e.target.value, index)} placeholder={t('editor.jobTitle')} className={inputClass}/>
                                    <input value={exp.company} onChange={e => handleInputChange('experience', 'company', e.target.value, index)} placeholder={t('editor.company')} className={inputClass}/>
                                    <input value={exp.location} onChange={e => handleInputChange('experience', 'location', e.target.value, index)} placeholder={t('editor.location')} className={inputClass}/>
                                    <div className="flex gap-2">
                                        <input type="month" value={exp.startDate} onChange={e => handleInputChange('experience', 'startDate', e.target.value, index)} placeholder={t('editor.startDate')} className={inputClass}/>
                                        <input type="month" value={exp.endDate === 'Present' ? '' : exp.endDate} disabled={exp.endDate === 'Present'} onChange={e => handleInputChange('experience', 'endDate', e.target.value, index)} placeholder={t('editor.endDate')} className={`${inputClass} disabled:bg-gray-200 dark:disabled:bg-gray-600`}/>
                                    </div>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={exp.endDate === 'Present'} onChange={e => handleInputChange('experience', 'endDate', e.target.checked ? 'Present' : '', index)} />
                                        {t('editor.present')}
                                    </label>
                                    <textarea value={exp.description} onChange={e => handleInputChange('experience', 'description', e.target.value, index)} placeholder={t('editor.description')} rows={3} className={inputClass}/>
                                    <div className="flex justify-between items-center pt-2">
                                        <button onClick={() => handleEnhance(`experience.${index}.description`, index)} disabled={!!enhancingField} className="text-sm text-primary disabled:text-gray-400">
                                        {enhancingField === `experience.${index}.description` ? t('editor.enhancing') : <><Icon icon="fa-solid fa-wand-magic-sparkles"/> {t('editor.enhanceWithAI')}</>}
                                        </button>
                                        <button onClick={() => handleRemoveItem('experience', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                    </div>
                                </div>
                            ))}
                        </Section>
                        
                        <Section title={t('editor.skills')} id="skills" onAdd={() => handleAddItem('skills')} addLabel={t('editor.addSkill')}>
                        {cvData.skills.map((skill, index) => (
                                <div key={skill.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                    <input value={skill.name} onChange={e => handleInputChange('skills', 'name', e.target.value, index)} placeholder={t('editor.skillName')} className={inputClass}/>
                                    <div>
                                        <label className="text-sm">{t('editor.skillLevel')}: {skill.level}/5</label>
                                        <input type="range" min="1" max="5" value={skill.level} onChange={e => handleInputChange('skills', 'level', parseInt(e.target.value), index)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"/>
                                    </div>
                                    <div className="text-right">
                                        <button onClick={() => handleRemoveItem('skills', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                    </div>
                                </div>
                            ))}
                        </Section>

                        <Section title={t('editor.languages')} id="languages" onAdd={() => handleAddItem('languages')} addLabel={t('editor.addLanguage')}>
                        {cvData.languages.map((lang, index) => (
                                <div key={lang.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                    <input value={lang.name} onChange={e => handleInputChange('languages', 'name', e.target.value, index)} placeholder={t('editor.languageName')} className={inputClass}/>
                                    <select value={lang.proficiency} onChange={e => handleInputChange('languages', 'proficiency', e.target.value, index)} className={inputClass}>
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                        <option>Fluent</option>
                                        <option>Native</option>
                                    </select>
                                    <div className="text-right">
                                        <button onClick={() => handleRemoveItem('languages', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                    </div>
                                </div>
                            ))}
                        </Section>

                        {/* DYNAMIC SECTIONS START */}
                        {cvData.certificates !== undefined && (
                            <Section title={t('editor.certificates')} id="certificates" onAdd={() => handleAddItem('certificates')} addLabel={t('editor.addCertificate')}>
                                {cvData.certificates.map((cert, index) => (
                                    <div key={cert.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                        <input value={cert.name} onChange={e => handleInputChange('certificates', 'name', e.target.value, index)} placeholder={t('editor.certificateName')} className={inputClass}/>
                                        <input value={cert.issuer} onChange={e => handleInputChange('certificates', 'issuer', e.target.value, index)} placeholder={t('editor.issuer')} className={inputClass}/>
                                        <input type="month" value={cert.date} onChange={e => handleInputChange('certificates', 'date', e.target.value, index)} placeholder={t('editor.date')} className={inputClass}/>
                                        <div className="text-right">
                                            <button onClick={() => handleRemoveItem('certificates', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                        </div>
                                    </div>
                                ))}
                            </Section>
                        )}
                        
                        {cvData.projects !== undefined && (
                            <Section title={t('editor.projects')} id="projects" onAdd={() => handleAddItem('projects')} addLabel={t('editor.addProject')}>
                                {cvData.projects.map((proj, index) => (
                                    <div key={proj.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                        <input value={proj.name} onChange={e => handleInputChange('projects', 'name', e.target.value, index)} placeholder={t('editor.projectName')} className={inputClass}/>
                                        <textarea value={proj.description} onChange={e => handleInputChange('projects', 'description', e.target.value, index)} placeholder={t('editor.description')} rows={3} className={inputClass}/>
                                        <input value={proj.link} onChange={e => handleInputChange('projects', 'link', e.target.value, index)} placeholder={t('editor.projectLink')} className={inputClass}/>
                                        <div className="text-right">
                                            <button onClick={() => handleRemoveItem('projects', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                        </div>
                                    </div>
                                ))}
                            </Section>
                        )}
                        
                        {cvData.references !== undefined && (
                            <Section title={t('editor.references')} id="references" onAdd={() => handleAddItem('references')} addLabel={t('editor.addReference')}>
                                {cvData.references.map((ref, index) => (
                                    <div key={ref.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                        <input value={ref.name} onChange={e => handleInputChange('references', 'name', e.target.value, index)} placeholder={t('editor.referenceName')} className={inputClass}/>
                                        <input value={ref.relation} onChange={e => handleInputChange('references', 'relation', e.target.value, index)} placeholder={t('editor.relation')} className={inputClass}/>
                                        <input value={ref.contact} onChange={e => handleInputChange('references', 'contact', e.target.value, index)} placeholder={t('editor.contactInfo')} className={inputClass}/>
                                        <div className="text-right">
                                            <button onClick={() => handleRemoveItem('references', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                        </div>
                                    </div>
                                ))}
                            </Section>
                        )}

                        {cvData.hobbies !== undefined && (
                            <Section title={t('editor.hobbies')} id="hobbies" onAdd={() => handleAddItem('hobbies')} addLabel={t('editor.addHobby')}>
                                {cvData.hobbies.map((hobby, index) => (
                                    <div key={hobby.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2 flex items-center gap-2">
                                        <input value={hobby.name} onChange={e => handleInputChange('hobbies', 'name', e.target.value, index)} placeholder={t('editor.hobbyName')} className={inputClass}/>
                                        <button onClick={() => handleRemoveItem('hobbies', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold p-2"><Icon icon="fa-solid fa-trash"/></button>
                                    </div>
                                ))}
                            </Section>
                        )}

                        {unaddedSections.length > 0 && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{t('editor.addSection')}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {unaddedSections.map(key => (
                                        <button
                                            key={key}
                                            onClick={() => handleAddSection(key as AvailableSectionKey)}
                                            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-primary hover:text-white transition"
                                        >
                                            + {t(availableSections[key as AvailableSectionKey])}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* DYNAMIC SECTIONS END */}
                    </div>
                     <div className="mt-6 md:hidden">
                        <button onClick={() => setMobileView('preview')} className="w-full py-3 bg-secondary text-white rounded-md font-bold">{t('editor.previewCV')}</button>
                    </div>
                </div>
            </aside>
            <div className={`flex-1 h-full flex-col ${mobileView === 'form' ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 md:hidden bg-gray-200 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
                     <button onClick={() => setMobileView('form')} className="px-4 py-2 bg-primary text-white rounded-md">
                         <Icon icon="fa-solid fa-pencil" className="mr-2" /> {t('editor.backToEditor')}
                     </button>
                </div>
                <CVPreview 
                    cvData={cvData} 
                    primaryColor={primaryColor} 
                    templates={templates} 
                    selectedTemplate={selectedTemplate}
                    previewMode={previewMode}
                />
            </div>
        </div>
    );
};


// --- Main App Logic ---
const AppContent: React.FC = () => {
    const { t } = useTranslations();
    const [page, setPage] = useState<Page>('home');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    
    // Global state for all users and CVs for admin panel
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [allCVs, setAllCVs] = useState<CVData[]>([]);
    const [adBanners, setAdBanners] = useState<AdBanner[]>([]);

    const [activeCV, setActiveCV] = useState<CVData | null>(null);
    const [selectedUserByAdmin, setSelectedUserByAdmin] = useState<User | null>(null);

    const templates: Template[] = [
      { id: 'minimalist', name: 'template.minimalist', component: MinimalistTemplate },
      { id: 'corporate', name: 'template.corporate', component: CorporateTemplate },
      { id: 'creative-column', name: 'template.creative-column', component: CreativeColumnTemplate },
      { id: 'infographic', name: 'template.infographic', component: InfographicTemplate },
      { id: 'photo-focus', name: 'template.photo-focus', component: PhotoFocusTemplate },
      { id: 'dark-mode', name: 'template.dark-mode', component: DarkModeTemplate },
      { id: 'color-block', name: 'template.color-block', component: ColorBlockTemplate },
      { id: 'typographic', name: 'template.typographic', component: TypographicTemplate },
      { id: 'modern-grid', name: 'template.modern-grid', component: ModernGridTemplate },
      { id: 'sidebar-nav', name: 'template.sidebar-nav', component: SidebarNavTemplate },
    ];
    
    // Load all data from localStorage on initial render
    useEffect(() => {
        try {
            const loggedInUser = localStorage.getItem('currentUser');
            if (loggedInUser) {
                const parsedUser = JSON.parse(loggedInUser);
                setCurrentUser(parsedUser);
            }

            const storedUsers = localStorage.getItem('allUsers');
            if (storedUsers) setAllUsers(JSON.parse(storedUsers));

            const storedCVs = localStorage.getItem('allCVs');
            if (storedCVs) setAllCVs(JSON.parse(storedCVs));
            
            const storedBanners = localStorage.getItem('adBanners');
            if (storedBanners) setAdBanners(JSON.parse(storedBanners));
        } catch (e) {
            console.error("Failed to parse data from localStorage", e);
        }
    }, []);
    
    useEffect(() => {
        // Redirect logged-in users away from the login page.
        if (currentUser && page === 'login') {
            setPage('dashboard');
        }
    }, [currentUser, page]);

    const handleLogin = (loginData: { email: string; role: 'user' | 'admin', joinDate: string }) => {
        const existingUser = allUsers.find(u => u.email === loginData.email);

        let userToLogin: User;
        let usersToStore = [...allUsers];

        if (existingUser) {
            if (existingUser.status === 'banned') {
                alert(t('login.banned'));
                return;
            }
            userToLogin = { ...existingUser, role: loginData.role }; // Update role in case it changed
        } else {
            const nameFromEmail = loginData.email.split('@')[0]
                .replace(/[._-]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
            
            userToLogin = {
                ...loginData,
                fullName: nameFromEmail,
                status: 'active', // New users are active by default
            };
            usersToStore.push(userToLogin);
        }
        
        setCurrentUser(userToLogin);
        localStorage.setItem('currentUser', JSON.stringify(userToLogin));

        if (!existingUser) {
            setAllUsers(usersToStore);
            localStorage.setItem('allUsers', JSON.stringify(usersToStore));
        }
        setPage('dashboard');
    };


    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        setActiveCV(null);
        setPage('home');
    };

    const handleUpdateUser = (updatedUser: User) => {
        if (!currentUser) return;
        
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        setAllUsers(prev => {
            const newUsers = prev.map(u => u.email === currentUser.email ? updatedUser : u);
            localStorage.setItem('allUsers', JSON.stringify(newUsers));
            return newUsers;
        });

        if (currentUser.email !== updatedUser.email) {
            setAllCVs(prev => {
                const newCVs = prev.map(cv => 
                    cv.userEmail === currentUser.email 
                    ? { ...cv, userEmail: updatedUser.email } 
                    : cv
                );
                localStorage.setItem('allCVs', JSON.stringify(newCVs));
                return newCVs;
            });
        }
    };

    const handleDeleteUser = () => {
        if (!currentUser) return;
        const userEmailToDelete = currentUser.email;

        setAllCVs(prev => {
            const remainingCVs = prev.filter(cv => cv.userEmail !== userEmailToDelete);
            localStorage.setItem('allCVs', JSON.stringify(remainingCVs));
            return remainingCVs;
        });

        setAllUsers(prev => {
            const remainingUsers = prev.filter(u => u.email !== userEmailToDelete);
            localStorage.setItem('allUsers', JSON.stringify(remainingUsers));
            return remainingUsers;
        });

        handleLogout();
    };

    // --- Admin User Management Functions ---
    const handleUpdateUserByAdmin = (updatedUser: User) => {
        setAllUsers(prev => {
            const newUsers = prev.map(u => u.email === updatedUser.email ? updatedUser : u);
            localStorage.setItem('allUsers', JSON.stringify(newUsers));
            return newUsers;
        });
    };

    const handleDeleteUserByAdmin = (userEmail: string) => {
         setAllCVs(prev => {
            const remainingCVs = prev.filter(cv => cv.userEmail !== userEmail);
            localStorage.setItem('allCVs', JSON.stringify(remainingCVs));
            return remainingCVs;
        });
        setAllUsers(prev => {
            const remainingUsers = prev.filter(u => u.email !== userEmail);
            localStorage.setItem('allUsers', JSON.stringify(remainingUsers));
            return remainingUsers;
        });
    };
    
// Fix: Expanded the `map` callback to explicitly define the new status's type.
// This prevents TypeScript from incorrectly widening the type to `string`,
// ensuring the created object conforms to the `User` interface and resolving type errors.
    const handleToggleUserBanByAdmin = (userEmail: string) => {
        setAllUsers(prev => {
            const newUsers = prev.map(u => {
                if (u.email === userEmail) {
                    const status: 'active' | 'banned' = u.status === 'active' ? 'banned' : 'active';
                    return { ...u, status };
                }
                return u;
            }
            );
            localStorage.setItem('allUsers', JSON.stringify(newUsers));
            setSelectedUserByAdmin(newUsers.find(u => u.email === userEmail) || null);
            return newUsers;
        });
    }

    const handleNewCV = (userEmail: string, initialData?: Partial<CVData>) => {
        const initialTemplate = getInitialCVData(t, userEmail);
        const newCV: CVData = {
            ...initialTemplate,
            ...initialData,
            id: uuidv4_mock(),
            createdAt: new Date().toISOString(),
            userEmail,
            personalInfo: { ...initialTemplate.personalInfo, ...(initialData?.personalInfo || {})},
            experience: (initialData?.experience || initialTemplate.experience).map(e => ({ ...e, id: uuidv4_mock() })),
            education: (initialData?.education || initialTemplate.education).map(e => ({ ...e, id: uuidv4_mock() })),
            skills: (initialData?.skills || initialTemplate.skills).map(s => ({ ...s, id: uuidv4_mock(), level: s.level || 3 })),
            languages: (initialData?.languages || initialTemplate.languages).map(l => ({ ...l, id: uuidv4_mock() })),
            certificates: (initialData?.certificates || []).map(c => ({...c, id: uuidv4_mock()})),
            projects: (initialData?.projects || []).map(p => ({...p, id: uuidv4_mock()})),
            references: (initialData?.references || []).map(r => ({...r, id: uuidv4_mock()})),
            hobbies: (initialData?.hobbies || []).map(h => ({...h, id: uuidv4_mock()})),
        };
        setActiveCV(newCV);
        setPage('editor');
    };

    const handleEditCV = (id: string) => {
        const cvToEdit = allCVs.find(cv => cv.id === id);
        if (cvToEdit) {
            setActiveCV(cvToEdit);
            setPage('editor');
        }
    };
    
    const handleDeleteCV = (id: string) => {
        if (window.confirm(t('editor.deleteConfirm'))) {
            setAllCVs(prev => {
                const updatedCVs = prev.filter(cv => cv.id !== id);
                localStorage.setItem('allCVs', JSON.stringify(updatedCVs));
                return updatedCVs;
            });
        }
    };

    const handleSaveCV = useCallback((cvToSave: CVData) => {
        if (!currentUser) return;
        const cvWithTimestamp = { ...cvToSave, lastUpdated: new Date().toISOString() };

        setAllCVs(prevCVs => {
            const existingIndex = prevCVs.findIndex(cv => cv.id === cvWithTimestamp.id);
            let updatedCVs;
            if (existingIndex > -1) {
                updatedCVs = [...prevCVs];
                updatedCVs[existingIndex] = cvWithTimestamp;
            } else {
                updatedCVs = [...prevCVs, cvWithTimestamp];
            }
            localStorage.setItem('allCVs', JSON.stringify(updatedCVs));
            return updatedCVs;
        });
    }, [currentUser]);

    // Admin Ad Banner Functions
    const addAd = (ad: Omit<AdBanner, 'id'>) => {
        setAdBanners(prev => {
            const newBanners = [...prev, { ...ad, id: uuidv4_mock() }];
            localStorage.setItem('adBanners', JSON.stringify(newBanners));
            return newBanners;
        });
    };
    const updateAd = (adToUpdate: AdBanner) => {
        setAdBanners(prev => {
            const updatedBanners = prev.map(ad => ad.id === adToUpdate.id ? adToUpdate : ad);
            localStorage.setItem('adBanners', JSON.stringify(updatedBanners));
            return updatedBanners;
        });
    };
    const deleteAd = (id: string) => {
        setAdBanners(prev => {
            const updatedBanners = prev.filter(ad => ad.id !== id);
            localStorage.setItem('adBanners', JSON.stringify(updatedBanners));
            return updatedBanners;
        });
    };

    const renderPage = () => {
        if (page === 'editor' && activeCV) {
            return <CVEditorPage activeCV={activeCV} onSaveCV={handleSaveCV} setPage={setPage} templates={templates} />;
        }
        if (page === 'dashboard' && currentUser) {
            const userCVs = allCVs.filter(cv => cv.userEmail === currentUser.email);
            return <DashboardPage user={currentUser} cvs={userCVs} adBanners={adBanners} setPage={setPage} onNewCV={handleNewCV} onEditCV={handleEditCV} onDeleteCV={handleDeleteCV} />;
        }
        if (page === 'login' && !currentUser) {
            return <LoginPage onLogin={handleLogin} setPage={setPage} />;
        }
        if (page === 'admin' && currentUser?.role === 'admin') {
            return <AdminPage allUsers={allUsers} allCVs={allCVs} adBanners={adBanners} onAddAd={addAd} onUpdateAd={updateAd} onDeleteAd={deleteAd} onSelectUser={setSelectedUserByAdmin}/>;
        }
        if (page === 'profile' && currentUser) {
            return <ProfileSettingsPage user={currentUser} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} />;
        }
        if (page === 'templates') {
            return <TemplatesPage setPage={setPage} templates={templates} />;
        }
         if (page === 'about') {
            return <AboutPage setPage={setPage} />;
        }
        return <HomePage setPage={setPage} templates={templates}/>;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header user={currentUser} setPage={setPage} onLogout={handleLogout} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            {page !== 'editor' && <Footer />}
            
            {selectedUserByAdmin && currentUser?.role === 'admin' && (
                <AdminUserModal 
                    user={selectedUserByAdmin}
                    onClose={() => setSelectedUserByAdmin(null)}
                    onSave={handleUpdateUserByAdmin}
                    onDelete={handleDeleteUserByAdmin}
                    onToggleBan={handleToggleUserBanByAdmin}
                />
            )}
        </div>
    );
};

// --- Language Provider and Main App Component ---
const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [language, setLanguage] = useState<AppLanguage>(getInitialLanguage());

    const t = useCallback((key: TranslationKey, ...args: (string | number)[]) => {
        let translation = translations[language][key] || translations['en'][key] || key;
        if (args.length > 0 && typeof translation === 'string') {
            args.forEach((arg, index) => {
                const regex = new RegExp(`\\{${index}\\}`, 'g');
                translation = translation.replace(regex, String(arg));
            });
        }
        return translation as string;
    }, [language]);
    
    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}
