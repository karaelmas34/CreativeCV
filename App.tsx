
import React, { useState, useEffect, useCallback } from 'react';
import type { Page, CVData, User, Template, AdBanner } from './types';
import { LanguageProvider, useTranslations } from './i18n';
import { getInitialCVData } from './utils/data';
import { uuidv4_mock } from './utils/uuid';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AdminUserModal } from './components/ui/AdminUserModal';

import { HomePage } from './components/pages/HomePage';
import { LoginPage } from './components/pages/LoginPage';
import { AboutPage } from './components/pages/AboutPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { TemplatesPage } from './components/pages/TemplatesPage';
import { AdminPage } from './components/pages/AdminPage';
import { ProfileSettingsPage } from './components/pages/ProfileSettingsPage';
import { CVEditorPage } from './components/pages/CVEditorPage';

import { 
    MinimalistTemplate, CorporateTemplate, CreativeColumnTemplate, InfographicTemplate, 
    PhotoFocusTemplate, DarkModeTemplate, ColorBlockTemplate, TypographicTemplate, 
    ModernGridTemplate, SidebarNavTemplate 
} from './templates';

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


export default function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}
