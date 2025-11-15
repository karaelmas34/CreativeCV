import React from 'react';
import type { TemplateProps } from './common';
import { Icon } from './common';

// Template 2: Corporate
export const CorporateTemplate: React.FC<TemplateProps> = ({ cvData, primaryColor = '#1f2937' }) => (
    <div className="bg-white text-gray-800 p-8 flex font-sans gap-8">
        <aside className="w-1/3 pr-8 border-r" style={{borderColor: '#e5e7eb'}}>
            {cvData.personalInfo.profilePicture && 
              <img src={cvData.personalInfo.profilePicture} alt={cvData.personalInfo.fullName} className="rounded-full w-32 h-32 mx-auto mb-6 object-cover" />
            }
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: primaryColor}}>{cvData.personalInfo.fullName}</h1>
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-semibold uppercase tracking-wider mb-3" style={{color: primaryColor}}>İletişim</h3>
                <p className="text-sm flex items-center gap-2 mb-1"><Icon icon="fa-solid fa-envelope" /> {cvData.personalInfo.email}</p>
                <p className="text-sm flex items-center gap-2 mb-1"><Icon icon="fa-solid fa-phone" /> {cvData.personalInfo.phoneNumber}</p>
                <p className="text-sm flex items-center gap-2 mb-1"><Icon icon="fa-solid fa-location-dot" /> {cvData.personalInfo.address}</p>
            </div>
             <div className="mt-6">
                <h3 className="text-lg font-semibold uppercase tracking-wider mb-3" style={{color: primaryColor}}>Yetenekler</h3>
                 {cvData.skills.map(skill => (
                    <div key={skill.id} className="mb-2">
                        <p className="text-sm font-medium">{skill.name}</p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                           <div className="h-1.5 rounded-full" style={{ width: `${skill.level * 20}%`, backgroundColor: primaryColor }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
        <main className="w-2/3">
            <section className="mb-6">
                <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4" style={{borderColor: primaryColor}}>Profil</h2>
                <p className="text-gray-700 text-sm leading-relaxed">{cvData.summary}</p>
            </section>
            <section className="mb-6">
                <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4" style={{borderColor: primaryColor}}>Eğitim</h2>
                {cvData.education.map(edu => (
                    <div key={edu.id} className="mb-4">
                        <h3 className="text-lg font-semibold">{edu.institution}</h3>
                        <p className="font-medium" style={{color: primaryColor}}>{edu.degree}, {edu.fieldOfStudy}</p>
                        <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                    </div>
                ))}
            </section>
             <section className="mb-6">
                <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4" style={{borderColor: primaryColor}}>İş Deneyimi</h2>
                {cvData.experience.map(exp => (
                    <div key={exp.id} className="mb-4">
                        <h3 className="text-lg font-semibold">{exp.title}</h3>
                        <p className="font-medium" style={{color: primaryColor}}>{exp.company} | {exp.location}</p>
                        <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                    </div>
                ))}
            </section>
             {cvData.projects && cvData.projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4" style={{borderColor: primaryColor}}>Projeler</h2>
                    {cvData.projects.map(proj => (
                        <div key={proj.id} className="mb-4">
                            <h3 className="text-lg font-semibold">{proj.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                        </div>
                    ))}
                </section>
            )}
            {cvData.certificates && cvData.certificates.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold border-b-2 pb-2 mb-4" style={{borderColor: primaryColor}}>Sertifikalar</h2>
                    {cvData.certificates.map(cert => (
                        <div key={cert.id} className="mb-4">
                            <h3 className="text-lg font-semibold">{cert.name}</h3>
                            <p className="font-medium" style={{color: primaryColor}}>{cert.issuer}</p>
                            <p className="text-xs text-gray-500">{cert.date}</p>
                        </div>
                    ))}
                </section>
            )}
        </main>
    </div>
);