
import React, { useState, useEffect, useRef } from 'react';
import type { Page, CVData, Template } from '../../types';
import { useTranslations, TranslationKey } from '../../i18n';
import { enhanceTextWithAI } from '../../services';
import { CVPreview } from '../editor/CVPreview';
import { Icon } from '../ui/Icon';

export const CVEditorPage: React.FC<{
    activeCV: CVData;
    onSaveCV: (cv: CVData) => void;
    setPage: (page: Page) => void;
    templates: Template[];
}> = ({ activeCV, onSaveCV, setPage, templates }) => {
    const { t, language } = useTranslations();
    const [cvData, setCVData] = useState(activeCV);
    const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0].id);
    const [primaryColor, setPrimaryColor] = useState('#4f46e5');
    const [enhancingField, setEnhancingField] = useState<string | null>(null);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [openSections, setOpenSections] = useState<string[]>(['personalInfo', 'summary', 'education', 'experience', 'skills', 'languages']);
    const profilePicInputRef = useRef<HTMLInputElement>(null);
    const [adFlowState, setAdFlowState] = useState<'idle' | 'pre-ad' | 'ad-running'>('idle');
    const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');

    const toggleSection = (section: string) => {
        setOpenSections(prev => 
            prev.includes(section) 
                ? prev.filter(s => s !== section) 
                : [...prev, section]
        );
    };

    const handleSaveAndExit = () => {
        onSaveCV(cvData);
        setPage('dashboard');
    };

    const executePrint = () => {
        window.dispatchEvent(new CustomEvent('execute-print'));
    };
    
    const startDownloadFlow = () => {
        setAdFlowState('pre-ad');
    };
    
    const handleAdWatched = () => {
        setAdFlowState('idle');
        executePrint();
    }

    const handleEnhance = async (field: 'summary' | `experience.${number}.description`, index?: number) => {
        const fieldKey = field as string;
        setEnhancingField(fieldKey);
        try {
            let textToEnhance = '';
            if (field === 'summary') {
                textToEnhance = cvData.summary;
            } else if (typeof index === 'number') {
                textToEnhance = cvData.experience[index].description;
            }
            
            const enhancedText = await enhanceTextWithAI(textToEnhance, language);

            if (field === 'summary') {
                setCVData(prev => ({ ...prev, summary: enhancedText }));
            } else if (typeof index === 'number') {
                setCVData(prev => {
                    const newExperience = [...prev.experience];
                    newExperience[index] = { ...newExperience[index], description: enhancedText };
                    return { ...prev, experience: newExperience };
                });
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.");
        } finally {
            setEnhancingField(null);
        }
    };

    const handleInputChange = (section: keyof CVData, key: string, value: any, index?: number) => {
        setCVData(prev => {
            const newData = {...prev};
            if(index !== undefined && Array.isArray(newData[section as keyof CVData])) {
                const arr = [...(newData[section as keyof CVData] as any[])];
                arr[index] = {...arr[index], [key]: value};
                return {...newData, [section]: arr};
            } else if (typeof newData[section as keyof CVData] === 'object' && newData[section as keyof CVData] !== null) {
                 return {...newData, [section]: {...(newData[section as keyof CVData] as object), [key]: value}};
            } else {
                 return {...newData, [key as keyof CVData]: value};
            }
        });
    }

    type SectionNames = 'experience' | 'education' | 'skills' | 'languages' | 'certificates' | 'projects' | 'references' | 'hobbies';

    const handleAddItem = (section: SectionNames) => {
        const newItem: any = { id: 'new-item-' + Date.now() }; // Temporary unique id
        switch (section) {
            case 'experience': newItem.title = ''; newItem.company = ''; newItem.location=''; newItem.startDate=''; newItem.endDate=''; newItem.description=''; break;
            case 'education': newItem.institution = ''; newItem.degree = ''; newItem.fieldOfStudy=''; newItem.startDate=''; newItem.endDate=''; break;
            case 'skills': newItem.name = ''; newItem.level = 3; break;
            case 'languages': newItem.name = ''; newItem.proficiency = 'Intermediate'; break;
            case 'certificates': newItem.name = ''; newItem.issuer = ''; newItem.date = ''; break;
            case 'projects': newItem.name = ''; newItem.description = ''; newItem.link = ''; break;
            case 'references': newItem.name = ''; newItem.relation = ''; newItem.contact = ''; break;
            case 'hobbies': newItem.name = ''; break;
        }
        setCVData(prev => ({...prev, [section]: [...(prev[section] || []), newItem]}));
    }

    const handleRemoveItem = (section: SectionNames, index: number) => {
        setCVData(prev => ({...prev, [section]: (prev[section] as any[])?.filter((_, i) => i !== index)}));
    }

    const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleInputChange('personalInfo', 'profilePicture', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const availableSections: { [key in Exclude<SectionNames, 'experience' | 'education' | 'skills' | 'languages'>]: TranslationKey } = {
        certificates: "editor.certificates",
        projects: "editor.projects",
        references: "editor.references",
        hobbies: "editor.hobbies",
    };
    type AvailableSectionKey = keyof typeof availableSections;
    
    const unaddedSections = Object.keys(availableSections)
        .filter(key => !cvData.hasOwnProperty(key));
        
    const handleAddSection = (sectionKey: AvailableSectionKey) => {
        if (!cvData.hasOwnProperty(sectionKey)) {
            setCVData(prev => ({
                ...prev,
                [sectionKey]: []
            }));
            setOpenSections(prev => [...prev, sectionKey]);
        }
    };


    const Section: React.FC<{title: string, id: string, children: React.ReactNode, onAdd?: () => void, addLabel?: string}> = ({title, id, children, onAdd, addLabel}) => (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <button onClick={() => toggleSection(id)} className="w-full flex justify-between items-center text-left py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md px-2">
                <h3 className="text-lg font-semibold">{title}</h3>
                <Icon icon={`fa-solid fa-chevron-${openSections.includes(id) ? 'up' : 'down'}`} className="transition-transform"/>
            </button>
            {openSections.includes(id) && (
                <div className="pt-4 px-2 animate-fadeIn space-y-4">
                    {children}
                    {onAdd && addLabel && (
                        <button onClick={onAdd} className="mt-2 text-sm text-secondary hover:text-secondary/80 font-semibold">
                            <Icon icon="fa-solid fa-plus-circle" className="mr-1"/> {addLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
    
    const inputClass = "w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary";

    const PreAdModal = () => (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl p-8 max-w-md w-full text-center animate-fadeIn">
                <Icon icon="fa-solid fa-shield-heart" className="text-4xl text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{t('editor.downloadAd.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{t('editor.downloadAd.body')}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setAdFlowState('idle')} className="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition">{t('editor.downloadAd.cancel')}</button>
                    <button onClick={() => setAdFlowState('ad-running')} className="px-6 py-2 rounded-md bg-secondary text-white hover:bg-secondary/90 transition">{t('editor.downloadAd.confirm')}</button>
                </div>
            </div>
        </div>
    );

    const AdModal = ({ onAdWatched }: {onAdWatched: () => void}) => {
        const [countdown, setCountdown] = useState(5);

        useEffect(() => {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
                return () => clearTimeout(timer);
            }
        }, [countdown]);

        return (
             <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                <div className="bg-black rounded-lg shadow-xl p-4 max-w-2xl w-full text-white animate-fadeIn relative">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold">{t('editor.ad.title')}</h3>
                         {countdown > 0 ? (
                            <span className="text-sm text-gray-400">{t('editor.ad.closeAfter', countdown)}</span>
                         ) : (
                            <button onClick={onAdWatched} className="text-sm hover:text-gray-300">&times; {t('editor.ad.closeNow')}</button>
                         )}
                    </div>
                    <div className="aspect-video bg-gray-800 flex items-center justify-center">
                        <img src="https://picsum.photos/seed/ad/600/337" alt="Advertisement" className="w-full h-full object-cover"/>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-65px)]">
            {adFlowState === 'pre-ad' && <PreAdModal />}
            {adFlowState === 'ad-running' && <AdModal onAdWatched={handleAdWatched} />}
            
            <aside className={`w-full md:w-[450px] flex-shrink-0 h-full bg-light-card dark:bg-dark-card shadow-lg ${mobileView === 'preview' ? 'hidden md:block' : 'block'}`}>
                <div className="h-full overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{t('editor.title')}</h2>
                        <div className="flex items-center gap-2">
                            <button onClick={handleSaveAndExit} className="px-4 py-2 bg-primary text-white rounded-md">{t('editor.done')}</button>
                            <button onClick={startDownloadFlow} className="px-4 py-2 bg-secondary text-white rounded-md">{t('editor.download')}</button>
                        </div>
                    </div>

                    <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-md p-1 mb-6">
                        <button onClick={() => setPreviewMode('desktop')} title={t('editor.desktopPreview')} className={`w-1/2 px-3 py-1 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300'}`} aria-label={t('editor.desktopPreview')}>
                            <Icon icon="fa-solid fa-desktop" className="mr-2" /> {t('editor.desktopPreview')}
                        </button>
                        <button onClick={() => setPreviewMode('mobile')} title={t('editor.mobilePreview')} className={`w-1/2 px-3 py-1 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300'}`} aria-label={t('editor.mobilePreview')}>
                            <Icon icon="fa-solid fa-mobile-screen-button" className="mr-2" /> {t('editor.mobilePreview')}
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="font-semibold">{t('editor.selectTemplate')}</label>
                            <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} className={inputClass}>
                                {templates.map(temp => <option key={temp.id} value={temp.id}>{t(temp.name as TranslationKey)}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="font-semibold">{t('editor.primaryColor')}</label>
                            <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-full mt-1 p-1 h-10"/>
                        </div>

                        <Section title={t('editor.personalInfo')} id="personalInfo">
                            <input value={cvData.personalInfo.fullName} onChange={e => handleInputChange('personalInfo', 'fullName', e.target.value)} placeholder={t('editor.fullName')} className={inputClass}/>
                            <input value={cvData.personalInfo.email} onChange={e => handleInputChange('personalInfo', 'email', e.target.value)} placeholder={t('editor.email')} className={inputClass}/>
                            <input value={cvData.personalInfo.phoneNumber} onChange={e => handleInputChange('personalInfo', 'phoneNumber', e.target.value)} placeholder={t('editor.phoneNumber')} className={inputClass}/>
                            <input value={cvData.personalInfo.address} onChange={e => handleInputChange('personalInfo', 'address', e.target.value)} placeholder={t('editor.address')} className={inputClass}/>
                            <input value={cvData.personalInfo.linkedin} onChange={e => handleInputChange('personalInfo', 'linkedin', e.target.value)} placeholder={t('editor.linkedin')} className={inputClass}/>
                            <input value={cvData.personalInfo.github} onChange={e => handleInputChange('personalInfo', 'github', e.target.value)} placeholder={t('editor.github')} className={inputClass}/>
                            <input value={cvData.personalInfo.website} onChange={e => handleInputChange('personalInfo', 'website', e.target.value)} placeholder={t('editor.website')} className={inputClass}/>
                            <div>
                                <label className="text-sm font-medium">{t('editor.profilePicture')}</label>
                                <div className="flex items-center gap-4 mt-1">
                                    <img 
                                        src={cvData.personalInfo.profilePicture || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} 
                                        alt="Profile" 
                                        className="w-16 h-16 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
                                    />
                                    <div className="flex-grow space-y-2">
                                        <input 
                                            type="file" 
                                            ref={profilePicInputRef} 
                                            className="hidden" 
                                            accept="image/png, image/jpeg, image/webp" 
                                            onChange={handleProfilePictureUpload}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => profilePicInputRef.current?.click()}
                                            className="w-full px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                        >
                                            {t('editor.changeImage')}
                                        </button>
                                        <input 
                                            value={cvData.personalInfo.profilePicture.startsWith('data:') ? '' : cvData.personalInfo.profilePicture} 
                                            onChange={e => handleInputChange('personalInfo', 'profilePicture', e.target.value)} 
                                            placeholder={t('editor.profilePictureUrl')} 
                                            className={`${inputClass}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title={t('editor.summary')} id="summary">
                            <textarea value={cvData.summary} onChange={e => setCVData(prev => ({ ...prev, summary: e.target.value }))} placeholder={t('editor.summaryPlaceholder')} rows={5} className={inputClass}/>
                            <button onClick={() => handleEnhance('summary')} disabled={!!enhancingField} className="mt-2 text-sm text-primary disabled:text-gray-400">
                                {enhancingField === 'summary' ? t('editor.enhancing') : <><Icon icon="fa-solid fa-wand-magic-sparkles"/> {t('editor.enhanceWithAI')}</>}
                            </button>
                        </Section>

                        <Section title={t('editor.education')} id="education" onAdd={() => handleAddItem('education')} addLabel={t('editor.addEducation')}>
                        {cvData.education.map((edu, index) => (
                                <div key={edu.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                    <input value={edu.institution} onChange={e => handleInputChange('education', 'institution', e.target.value, index)} placeholder={t('editor.institution')} className={inputClass}/>
                                    <input value={edu.degree} onChange={e => handleInputChange('education', 'degree', e.target.value, index)} placeholder={t('editor.degree')} className={inputClass}/>
                                    <input value={edu.fieldOfStudy} onChange={e => handleInputChange('education', 'fieldOfStudy', e.target.value, index)} placeholder={t('editor.fieldOfStudy')} className={inputClass}/>
                                    <div className="flex gap-2">
                                        <input type="month" value={edu.startDate} onChange={e => handleInputChange('education', 'startDate', e.target.value, index)} placeholder={t('editor.startDate')} className={inputClass}/>
                                        <input type="month" value={edu.endDate} onChange={e => handleInputChange('education', 'endDate', e.target.value, index)} placeholder={t('editor.endDate')} className={inputClass}/>
                                    </div>
                                    <div className="text-right">
                                        <button onClick={() => handleRemoveItem('education', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                    </div>
                                </div>
                            ))}
                        </Section>

                        <Section title={t('editor.experience')} id="experience" onAdd={() => handleAddItem('experience')} addLabel={t('editor.addExperience')}>
                            {cvData.experience.map((exp, index) => (
                                <div key={exp.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                    <input value={exp.title} onChange={e => handleInputChange('experience', 'title', e.target.value, index)} placeholder={t('editor.jobTitle')} className={inputClass}/>
                                    <input value={exp.company} onChange={e => handleInputChange('experience', 'company', e.target.value, index)} placeholder={t('editor.company')} className={inputClass}/>
                                    <input value={exp.location} onChange={e => handleInputChange('experience', 'location', e.target.value, index)} placeholder={t('editor.location')} className={inputClass}/>
                                    <div className="flex gap-2">
                                        <input type="month" value={exp.startDate} onChange={e => handleInputChange('experience', 'startDate', e.target.value, index)} placeholder={t('editor.startDate')} className={inputClass}/>
                                        <input type="month" value={exp.endDate === 'Present' ? '' : exp.endDate} disabled={exp.endDate === 'Present'} onChange={e => handleInputChange('experience', 'endDate', e.target.value, index)} placeholder={t('editor.endDate')} className={`${inputClass} disabled:bg-gray-200 dark:disabled:bg-gray-600`}/>
                                    </div>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={exp.endDate === 'Present'} onChange={e => handleInputChange('experience', 'endDate', e.target.checked ? 'Present' : '', index)} />
                                        {t('editor.present')}
                                    </label>
                                    <textarea value={exp.description} onChange={e => handleInputChange('experience', 'description', e.target.value, index)} placeholder={t('editor.description')} rows={3} className={inputClass}/>
                                    <div className="flex justify-between items-center pt-2">
                                        <button onClick={() => handleEnhance(`experience.${index}.description`, index)} disabled={!!enhancingField} className="text-sm text-primary disabled:text-gray-400">
                                        {enhancingField === `experience.${index}.description` ? t('editor.enhancing') : <><Icon icon="fa-solid fa-wand-magic-sparkles"/> {t('editor.enhanceWithAI')}</>}
                                        </button>
                                        <button onClick={() => handleRemoveItem('experience', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                    </div>
                                </div>
                            ))}
                        </Section>
                        
                        <Section title={t('editor.skills')} id="skills" onAdd={() => handleAddItem('skills')} addLabel={t('editor.addSkill')}>
                        {cvData.skills.map((skill, index) => (
                                <div key={skill.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                    <input value={skill.name} onChange={e => handleInputChange('skills', 'name', e.target.value, index)} placeholder={t('editor.skillName')} className={inputClass}/>
                                    <div>
                                        <label className="text-sm">{t('editor.skillLevel')}: {skill.level}/5</label>
                                        <input type="range" min="1" max="5" value={skill.level} onChange={e => handleInputChange('skills', 'level', parseInt(e.target.value), index)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"/>
                                    </div>
                                    <div className="text-right">
                                        <button onClick={() => handleRemoveItem('skills', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                    </div>
                                </div>
                            ))}
                        </Section>

                        <Section title={t('editor.languages')} id="languages" onAdd={() => handleAddItem('languages')} addLabel={t('editor.addLanguage')}>
                        {cvData.languages.map((lang, index) => (
                                <div key={lang.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                    <input value={lang.name} onChange={e => handleInputChange('languages', 'name', e.target.value, index)} placeholder={t('editor.languageName')} className={inputClass}/>
                                    <select value={lang.proficiency} onChange={e => handleInputChange('languages', 'proficiency', e.target.value, index)} className={inputClass}>
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                        <option>Fluent</option>
                                        <option>Native</option>
                                    </select>
                                    <div className="text-right">
                                        <button onClick={() => handleRemoveItem('languages', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                    </div>
                                </div>
                            ))}
                        </Section>

                        {/* DYNAMIC SECTIONS START */}
                        {cvData.certificates !== undefined && (
                            <Section title={t('editor.certificates')} id="certificates" onAdd={() => handleAddItem('certificates')} addLabel={t('editor.addCertificate')}>
                                {cvData.certificates.map((cert, index) => (
                                    <div key={cert.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                        <input value={cert.name} onChange={e => handleInputChange('certificates', 'name', e.target.value, index)} placeholder={t('editor.certificateName')} className={inputClass}/>
                                        <input value={cert.issuer} onChange={e => handleInputChange('certificates', 'issuer', e.target.value, index)} placeholder={t('editor.issuer')} className={inputClass}/>
                                        <input type="month" value={cert.date} onChange={e => handleInputChange('certificates', 'date', e.target.value, index)} placeholder={t('editor.date')} className={inputClass}/>
                                        <div className="text-right">
                                            <button onClick={() => handleRemoveItem('certificates', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                        </div>
                                    </div>
                                ))}
                            </Section>
                        )}
                        
                        {cvData.projects !== undefined && (
                            <Section title={t('editor.projects')} id="projects" onAdd={() => handleAddItem('projects')} addLabel={t('editor.addProject')}>
                                {cvData.projects.map((proj, index) => (
                                    <div key={proj.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                        <input value={proj.name} onChange={e => handleInputChange('projects', 'name', e.target.value, index)} placeholder={t('editor.projectName')} className={inputClass}/>
                                        <textarea value={proj.description} onChange={e => handleInputChange('projects', 'description', e.target.value, index)} placeholder={t('editor.description')} rows={3} className={inputClass}/>
                                        <input value={proj.link} onChange={e => handleInputChange('projects', 'link', e.target.value, index)} placeholder={t('editor.projectLink')} className={inputClass}/>
                                        <div className="text-right">
                                            <button onClick={() => handleRemoveItem('projects', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                        </div>
                                    </div>
                                ))}
                            </Section>
                        )}
                        
                        {cvData.references !== undefined && (
                            <Section title={t('editor.references')} id="references" onAdd={() => handleAddItem('references')} addLabel={t('editor.addReference')}>
                                {cvData.references.map((ref, index) => (
                                    <div key={ref.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2">
                                        <input value={ref.name} onChange={e => handleInputChange('references', 'name', e.target.value, index)} placeholder={t('editor.referenceName')} className={inputClass}/>
                                        <input value={ref.relation} onChange={e => handleInputChange('references', 'relation', e.target.value, index)} placeholder={t('editor.relation')} className={inputClass}/>
                                        <input value={ref.contact} onChange={e => handleInputChange('references', 'contact', e.target.value, index)} placeholder={t('editor.contactInfo')} className={inputClass}/>
                                        <div className="text-right">
                                            <button onClick={() => handleRemoveItem('references', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">{t('editor.remove')}</button>
                                        </div>
                                    </div>
                                ))}
                            </Section>
                        )}

                        {cvData.hobbies !== undefined && (
                            <Section title={t('editor.hobbies')} id="hobbies" onAdd={() => handleAddItem('hobbies')} addLabel={t('editor.addHobby')}>
                                {cvData.hobbies.map((hobby, index) => (
                                    <div key={hobby.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded space-y-2 flex items-center gap-2">
                                        <input value={hobby.name} onChange={e => handleInputChange('hobbies', 'name', e.target.value, index)} placeholder={t('editor.hobbyName')} className={inputClass}/>
                                        <button onClick={() => handleRemoveItem('hobbies', index)} className="text-red-500 hover:text-red-700 text-sm font-semibold p-2"><Icon icon="fa-solid fa-trash"/></button>
                                    </div>
                                ))}
                            </Section>
                        )}

                        {unaddedSections.length > 0 && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{t('editor.addSection')}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {unaddedSections.map(key => (
                                        <button
                                            key={key}
                                            onClick={() => handleAddSection(key as AvailableSectionKey)}
                                            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-primary hover:text-white transition"
                                        >
                                            + {t(availableSections[key as AvailableSectionKey])}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* DYNAMIC SECTIONS END */}
                    </div>
                     <div className="mt-6 md:hidden">
                        <button onClick={() => setMobileView('preview')} className="w-full py-3 bg-secondary text-white rounded-md font-bold">{t('editor.previewCV')}</button>
                    </div>
                </div>
            </aside>
            <div className={`flex-1 h-full flex-col ${mobileView === 'form' ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 md:hidden bg-gray-200 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
                     <button onClick={() => setMobileView('form')} className="px-4 py-2 bg-primary text-white rounded-md">
                         <Icon icon="fa-solid fa-pencil" className="mr-2" /> {t('editor.backToEditor')}
                     </button>
                </div>
                <CVPreview 
                    cvData={cvData} 
                    primaryColor={primaryColor} 
                    templates={templates} 
                    selectedTemplate={selectedTemplate}
                    previewMode={previewMode}
                />
            </div>
        </div>
    );
};
