import React from 'react';
import type { TemplateProps } from './common';

// Template 9: Modern Grid
export const ModernGridTemplate: React.FC<TemplateProps> = ({ cvData, primaryColor = '#06b6d4' }) => (
    <div className="bg-gray-50 p-8 font-sans">
        <header className="bg-white p-8 rounded-lg shadow-md text-center mb-8">
            {cvData.personalInfo.profilePicture &&
                <img src={cvData.personalInfo.profilePicture} alt={cvData.personalInfo.fullName} className="w-32 h-32 rounded-full mx-auto -mt-24 mb-4 border-4 border-white object-cover" />
            }
            <h1 className="text-4xl font-bold" style={{ color: primaryColor }}>{cvData.personalInfo.fullName}</h1>
            <p className="text-lg text-gray-600">{cvData.experience[0]?.title}</p>
            <p className="text-sm text-gray-500 mt-4 max-w-2xl mx-auto">{cvData.summary}</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                 <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>Deneyim</h2>
                 {cvData.experience.map(exp => (
                    <div key={exp.id} className="border-l-4 pl-4 mb-4" style={{borderColor: primaryColor}}>
                        <h3 className="font-semibold">{exp.title}</h3>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                        <p className="text-xs text-gray-400">{exp.startDate} - {exp.endDate}</p>
                    </div>
                 ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>İletişim</h2>
                 <p className="text-sm mb-2 break-all">{cvData.personalInfo.email}</p>
                 <p className="text-sm mb-2">{cvData.personalInfo.phoneNumber}</p>
                 <p className="text-sm">{cvData.personalInfo.address}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-3">
                 <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>Eğitim</h2>
                  {cvData.education.map(edu => (
                    <div key={edu.id} className="border-l-4 pl-4 mb-4 inline-block mr-8" style={{borderColor: primaryColor}}>
                        <h3 className="font-semibold">{edu.institution}</h3>
                        <p className="text-sm text-gray-600">{edu.degree}, {edu.fieldOfStudy}</p>
                        <p className="text-xs text-gray-400">{edu.startDate} - {edu.endDate}</p>
                    </div>
                 ))}
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-3">
                 <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>Yetenekler</h2>
                 <div className="flex flex-wrap gap-2">
                    {cvData.skills.map(s => <span key={s.id} className="text-xs px-3 py-1 rounded-full text-white" style={{backgroundColor: primaryColor}}>{s.name}</span>)}
                 </div>
            </div>
            {cvData.projects && cvData.projects.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-3">
                    <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>Projeler</h2>
                    {cvData.projects.map(p => (
                        <div key={p.id} className="mb-2">
                            <h3 className="font-semibold">{p.name}</h3>
                            <p className="text-sm text-gray-600">{p.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);