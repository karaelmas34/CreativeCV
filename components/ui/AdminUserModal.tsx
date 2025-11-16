
import React, { useState } from 'react';
import type { User } from '../../types';
import { useTranslations } from '../../i18n';

export const AdminUserModal: React.FC<{
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
