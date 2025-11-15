import React from 'react';
import type { TemplateProps } from './common';

// Template 7: Color Block
export const ColorBlockTemplate: React.FC<TemplateProps> = ({ cvData, primaryColor = '#f59e0b' }) => (
    <div className="font-sans grid grid-cols-3">
        <div className="col-span-1 p-8 text-white" style={{backgroundColor: primaryColor}}>
            {cvData.personalInfo.profilePicture && 
                <img src={cvData.personalInfo.profilePicture} alt={cvData.personalInfo.fullName} className="rounded-full w-32 h-32 mx-auto mb-6 object-cover border-4 border-white/50" />
            }
            <div className="text-center">
                <h1 className="text-2xl font-bold">{cvData.personalInfo.fullName}</h1>
                <p className="text-sm opacity-90">{cvData.experience[0]?.title}</p>
            </div>
            <div className="border-t border-white/30 my-6"></div>
            <h3 className="font-bold">İletişim</h3>
            <p className="text-xs mt-2">{cvData.personalInfo.email}</p>
            <p className="text-xs mt-1">{cvData.personalInfo.phoneNumber}</p>
            <p className="text-xs mt-1">{cvData.personalInfo.address}</p>

            <div className="border-t border-white/30 my-6"></div>
            <h3 className="font-bold">Yetenekler</h3>
            {cvData.skills.map(s => <p key={s.id} className="text-xs mt-2">{s.name}</p>)}
            
            {cvData.hobbies && cvData.hobbies.length > 0 && (
              <>
                <div className="border-t border-white/30 my-6"></div>
                <h3 className="font-bold">Hobiler</h3>
                {cvData.hobbies.map(h => <p key={h.id} className="text-xs mt-2">{h.name}</p>)}
              </>
            )}
        </div>
        <div className="col-span-2 p-8 bg-white">
            <section className="mb-6">
                <h2 className="text-xl font-bold uppercase tracking-wider" style={{color: primaryColor}}>Hakkımda</h2>
                <p className="text-sm text-gray-700 mt-2">{cvData.summary}</p>
            </section>
             <section className="mb-6">
                <h2 className="text-xl font-bold uppercase tracking-wider" style={{color: primaryColor}}>Deneyim</h2>
                 {cvData.experience.map(exp => (
                    <div key={exp.id} className="mt-4">
                        <h3 className="text-lg font-semibold">{exp.title}</h3>
                        <p className="text-sm font-medium text-gray-600">{exp.company} / {exp.startDate} - {exp.endDate}</p>
                        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                    </div>
                ))}
            </section>
            <section className="mb-6">
                <h2 className="text-xl font-bold uppercase tracking-wider" style={{color: primaryColor}}>Eğitim</h2>
                {cvData.education.map(edu => (
                    <div key={edu.id} className="mt-4">
                        <h3 className="text-lg font-semibold">{edu.institution}</h3>
                        <p className="text-sm font-medium text-gray-600">{edu.degree} / {edu.startDate} - {edu.endDate}</p>
                    </div>
                ))}
            </section>
             {cvData.certificates && cvData.certificates.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold uppercase tracking-wider" style={{color: primaryColor}}>Sertifikalar</h2>
                    {cvData.certificates.map(cert => (
                        <div key={cert.id} className="mt-4">
                            <h3 className="text-lg font-semibold">{cert.name}</h3>
                            <p className="text-sm font-medium text-gray-600">{cert.issuer} / {cert.date}</p>
                        </div>
                    ))}
                </section>
            )}
        </div>
    </div>
);