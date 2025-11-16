
import React, { useState } from 'react';
import type { Page } from '../../types';
import { useTranslations } from '../../i18n';

export const LoginPage: React.FC<{ onLogin: (data: { email: string; role: 'user' | 'admin', joinDate: string }) => void; setPage: (page: Page) => void }> = ({ onLogin, setPage }) => {
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
