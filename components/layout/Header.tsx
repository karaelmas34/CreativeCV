
import React, { useState, useEffect, useRef } from 'react';
import type { Page, User } from '../../types';
import { useTranslations } from '../../i18n';
import type { AppLanguage } from '../../i18n';
import { Icon } from '../ui/Icon';

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

export const Header: React.FC<{ user: User | null; setPage: (page: Page) => void; onLogout: () => void; }> = ({ user, setPage, onLogout }) => {
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
