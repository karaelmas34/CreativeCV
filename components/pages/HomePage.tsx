
import React from 'react';
import type { Page, Template } from '../../types';
// Fix: Import TranslationKey to correctly cast the template name for the translation function.
import { useTranslations, type TranslationKey } from '../../i18n';
import { getInitialCVData } from '../../utils/data';
import { Icon } from '../ui/Icon';

export const HomePage: React.FC<{ setPage: (page: Page) => void, templates: Template[] }> = ({ setPage, templates }) => {
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
{/* Fix: Cast template.name to TranslationKey to match the 't' function's expected type. */}
                                   {t(template.name as TranslationKey)}
                                </span>
                            </div>
                        </div>
                        {/* Fix: Cast template.name to TranslationKey to match the 't' function's expected type. */}
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