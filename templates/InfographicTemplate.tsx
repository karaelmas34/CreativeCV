import React from 'react';
import type { TemplateProps } from './common';
import { Icon } from './common';

// Template 4: Infographic
export const InfographicTemplate: React.FC<TemplateProps> = ({ cvData, primaryColor = '#3b82f6' }) => (
    <div className="bg-white p-8 grid grid-cols-3 gap-6 font-sans">
        <div className="col-span-1 flex flex-col items-center text-center bg-gray-50 p-6 rounded-lg">
            {cvData.personalInfo.profilePicture && 
                <img src={cvData.personalInfo.profilePicture} alt={cvData.personalInfo.fullName} className="rounded-full w-36 h-36 mb-4 object-cover ring-4" style={{'--tw-ring-color': primaryColor} as React.CSSProperties}/>
            }
            <h1 className="text-3xl font-bold" style={{color: primaryColor}}>{cvData.personalInfo.fullName}</h1>
            <p className="text-md text-gray-600 mt-1">{cvData.experience[0]?.title || 'Profesyonel'}</p>
            <div className="my-6 w-full border-t"></div>
            <div className="text-left w-full">
              <p className="text-sm flex items-center gap-3 mb-2"><Icon icon="fa-solid fa-envelope" style={{color: primaryColor}}/> {cvData.personalInfo.email}</p>
              <p className="text-sm flex items-center gap-3 mb-2"><Icon icon="fa-solid fa-phone" style={{color: primaryColor}}/> {cvData.personalInfo.phoneNumber}</p>
              <p className="text-sm flex items-center gap-3"><Icon icon="fa-solid fa-location-dot" style={{color: primaryColor}}/> {cvData.personalInfo.address}</p>
            </div>
        </div>
        <div className="col-span-2">
            <section className="mb-6">
                <h2 className="text-xl font-bold uppercase flex items-center gap-3" style={{color: primaryColor}}><Icon icon="fa-solid fa-user" className="text-2xl"/> Özet</h2>
                <p className="text-sm text-gray-700 mt-2 pl-9">{cvData.summary}</p>
            </section>
            <section className="mb-6">
                 <h2 className="text-xl font-bold uppercase flex items-center gap-3" style={{color: primaryColor}}><Icon icon="fa-solid fa-graduation-cap" className="text-2xl"/> Eğitim</h2>
                 {cvData.education.map(edu => (
                    <div key={edu.id} className="mt-3 pl-9">
                        <h3 className="text-md font-semibold">{edu.institution}</h3>
                        <p className="text-sm">{edu.degree}</p>
                        <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                    </div>
                ))}
            </section>
            <section className="mb-6">
                <h2 className="text-xl font-bold uppercase flex items-center gap-3" style={{color: primaryColor}}><Icon icon="fa-solid fa-briefcase" className="text-2xl"/> Deneyim</h2>
                 {cvData.experience.map(exp => (
                    <div key={exp.id} className="mt-3 pl-9">
                        <h3 className="text-md font-semibold">{exp.title} at {exp.company}</h3>
                        <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                    </div>
                ))}
            </section>
            <section className="mb-6">
                 <h2 className="text-xl font-bold uppercase flex items-center gap-3" style={{color: primaryColor}}><Icon icon="fa-solid fa-star" className="text-2xl"/> Yetenekler</h2>
                 <div className="mt-3 pl-9 grid grid-cols-2 gap-x-6 gap-y-2">
                     {cvData.skills.map(skill => (
                        <div key={skill.id} className="flex items-center">
                            <span className="text-sm font-medium w-32">{skill.name}</span>
                            <div className="flex gap-1">
                                {Array.from({length: 5}).map((_, i) => (
                                    <Icon key={i} icon="fa-solid fa-circle" className={`text-xs ${i < skill.level ? '' : 'text-gray-300'}`} style={{color: i < skill.level ? primaryColor : ''}} />
                                ))}
                            </div>
                        </div>
                     ))}
                 </div>
            </section>
            {cvData.certificates && cvData.certificates.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold uppercase flex items-center gap-3" style={{color: primaryColor}}><Icon icon="fa-solid fa-award" className="text-2xl"/> Sertifikalar</h2>
                    {cvData.certificates.map(cert => (
                        <div key={cert.id} className="mt-3 pl-9">
                            <h3 className="text-md font-semibold">{cert.name}</h3>
                            <p className="text-sm text-gray-600">{cert.issuer} - {cert.date}</p>
                        </div>
                    ))}
                </section>
            )}
        </div>
    </div>
);