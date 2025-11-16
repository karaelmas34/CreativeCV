
import React from 'react';
import type { Page, Template } from '../../types';
// Fix: Import TranslationKey to correctly cast the template name for the translation function.
import { useTranslations, type TranslationKey } from '../../i18n';
import { getInitialCVData } from '../../utils/data';

export const TemplatesPage: React.FC<{ setPage: (page: Page) => void; templates: Template[] }> = ({ setPage, templates }) => {
    const { t } = useTranslations();
    const initialCVData = getInitialCVData(t, 'preview@example.com');
    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-center mb-12">{t('templates.title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {templates.map(template => (
                    <div key={template.id} className="bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-lg cursor-pointer transform hover:-translate-y-2 transition-transform duration-300" onClick={() => setPage('login')}>
                        <div className="aspect-[1/1.414] w-full bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                           <template.component cvData={initialCVData} />
                        </div>
                        {/* Fix: Cast template.name to TranslationKey to match the 't' function's expected type. */}
                        <h3 className="mt-4 font-semibold text-lg text-center">{t(template.name as TranslationKey)}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};