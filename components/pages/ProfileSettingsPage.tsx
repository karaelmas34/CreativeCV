
import React, { useState } from 'react';
import type { User } from '../../types';
import { useTranslations } from '../../i18n';

export const ProfileSettingsPage: React.FC<{
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
