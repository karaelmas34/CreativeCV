
import React, { useState } from 'react';
import type { User, CVData, AdBanner } from '../../types';
import { useTranslations } from '../../i18n';
import { Icon } from '../ui/Icon';

export const AdminPage: React.FC<{
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
