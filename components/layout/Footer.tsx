
import React from 'react';
import { useTranslations } from '../../i18n';

export const Footer: React.FC = () => {
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
