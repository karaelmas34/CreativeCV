
import React from 'react';
import type { User, CVData, AdBanner, Page } from '../../types';
import { useTranslations } from '../../i18n';
import { CVUploader } from '../ui/CVUploader';
import { Icon } from '../ui/Icon';

export const DashboardPage: React.FC<{
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
