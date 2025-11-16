
import React from 'react';
import type { Page } from '../../types';
import { useTranslations } from '../../i18n';
import { Icon } from '../ui/Icon';

export const AboutPage: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
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
