import React from 'react';
import type { TemplateProps } from './common';

// Template 5: Photo Focus
export const PhotoFocusTemplate: React.FC<TemplateProps> = ({ cvData, primaryColor = '#8b5cf6' }) => (
    <div className="bg-white font-sans">
        <header className="h-64 bg-gray-200 relative flex items-center justify-center text-center p-8" style={{backgroundImage: `url(${cvData.personalInfo.profilePicture || 'https://picsum.photos/1200/400'})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10">
                <h1 className="text-6xl font-extrabold text-white tracking-tight">{cvData.personalInfo.fullName}</h1>
                <p className="text-xl text-white/90 mt-2">{cvData.experience[0]?.title || 'Profesyonel'}</p>
            </div>
        </header>
        <main className="p-10 grid grid-cols-12 gap-10">
            <div className="col-span-4">
                 <h3 className="font-bold text-lg uppercase tracking-wider mb-3" style={{color: primaryColor}}>Hakkımda</h3>
                 <p className="text-sm text-gray-600 mb-6">{cvData.summary}</p>

                 <h3 className="font-bold text-lg uppercase tracking-wider mb-3" style={{color: primaryColor}}>İletişim</h3>
                 <p className="text-sm text-gray-600 mb-1">{cvData.personalInfo.email}</p>
                 <p className="text-sm text-gray-600 mb-1">{cvData.personalInfo.phoneNumber}</p>
                 <p className="text-sm text-gray-600">{cvData.personalInfo.address}</p>

                 <h3 className="font-bold text-lg uppercase tracking-wider mt-6 mb-3" style={{color: primaryColor}}>Yetenekler</h3>
                 <div className="flex flex-wrap gap-2">
                     {cvData.skills.map(skill => <span key={skill.id} className="bg-gray-100 text-sm px-3 py-1 rounded-full">{skill.name}</span>)}
                 </div>
            </div>
            <div className="col-span-8">
                <h3 className="font-bold text-lg uppercase tracking-wider mb-4" style={{color: primaryColor}}>Deneyim</h3>
                 {cvData.experience.map(exp => (
                    <div key={exp.id} className="mb-5 relative pl-5">
                        <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full" style={{backgroundColor: primaryColor}}></div>
                        <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                        <h4 className="font-semibold text-md">{exp.title}, {exp.company}</h4>
                        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                    </div>
                ))}

                <h3 className="font-bold text-lg uppercase tracking-wider mt-8 mb-4" style={{color: primaryColor}}>Eğitim</h3>
                 {cvData.education.map(edu => (
                    <div key={edu.id} className="mb-5 relative pl-5">
                        <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full" style={{backgroundColor: primaryColor}}></div>
                        <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                        <h4 className="font-semibold text-md">{edu.institution}</h4>
                        <p className="text-sm text-gray-600">{edu.degree}, {edu.fieldOfStudy}</p>
                    </div>
                ))}
                 
                {cvData.projects && cvData.projects.length > 0 && (
                  <>
                    <h3 className="font-bold text-lg uppercase tracking-wider mt-8 mb-4" style={{color: primaryColor}}>Projeler</h3>
                    {cvData.projects.map(proj => (
                      <div key={proj.id} className="mb-5 relative pl-5">
                          <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full" style={{backgroundColor: primaryColor}}></div>
                          <h4 className="font-semibold text-md">{proj.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                      </div>
                    ))}
                  </>
                )}
            </div>
        </main>
    </div>
);