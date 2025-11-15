import React from 'react';
import type { TemplateProps } from './common';

// Template 8: Typographic
export const TypographicTemplate: React.FC<TemplateProps> = ({ cvData, primaryColor = '#d946ef' }) => (
    <div className="bg-white p-12 font-serif">
        <div className="flex items-center gap-10">
            {cvData.personalInfo.profilePicture && (
                <img 
                    src={cvData.personalInfo.profilePicture} 
                    alt={cvData.personalInfo.fullName}
                    className="w-40 h-40 rounded-full object-cover flex-shrink-0"
                />
            )}
            <div>
                <h1 className="text-7xl font-extrabold text-gray-800">{cvData.personalInfo.fullName.split(' ')[0]}</h1>
                <h1 className="text-7xl font-extrabold" style={{color: primaryColor}}>{cvData.personalInfo.fullName.split(' ').slice(1).join(' ')}</h1>
                <div className="flex space-x-6 text-sm mt-4 text-gray-500">
                    <span>{cvData.personalInfo.email}</span>
                    <span>{cvData.personalInfo.phoneNumber}</span>
                    <span>{cvData.personalInfo.address}</span>
                </div>
            </div>
        </div>
        <p className="text-lg mt-10 text-gray-700 max-w-4xl">{cvData.summary}</p>
        
        <div className="grid grid-cols-12 gap-12 mt-12">
            <div className="col-span-7">
                <h2 className="text-3xl font-bold mb-6 border-b-2 pb-2" style={{borderColor: primaryColor}}>Deneyim</h2>
                 {cvData.experience.map(exp => (
                    <div key={exp.id} className="mb-6">
                        <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                        <h3 className="text-xl font-semibold">{exp.title}</h3>
                        <p className="text-md text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                    </div>
                ))}

                <h2 className="text-3xl font-bold mt-10 mb-6 border-b-2 pb-2" style={{borderColor: primaryColor}}>Eğitim</h2>
                 {cvData.education.map(edu => (
                    <div key={edu.id} className="mb-6">
                        <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                        <h3 className="text-xl font-semibold">{edu.institution}</h3>
                        <p className="text-md text-gray-600">{edu.degree}</p>
                    </div>
                ))}
            </div>
            <div className="col-span-5">
                 <h2 className="text-3xl font-bold mb-6 border-b-2 pb-2" style={{borderColor: primaryColor}}>Yetenekler</h2>
                 <div className="flex flex-wrap gap-x-6 gap-y-3">
                     {cvData.skills.map(skill => <span key={skill.id} className="text-md font-medium text-gray-700">{skill.name}</span>)}
                 </div>
                 
                 {cvData.certificates && cvData.certificates.length > 0 && (
                    <>
                        <h2 className="text-3xl font-bold mt-10 mb-6 border-b-2 pb-2" style={{borderColor: primaryColor}}>Sertifikalar</h2>
                        {cvData.certificates.map(cert => (
                            <div key={cert.id} className="mb-4">
                                <h3 className="text-lg font-semibold">{cert.name}</h3>
                                <p className="text-sm text-gray-600">{cert.issuer}</p>
                            </div>
                        ))}
                    </>
                 )}
            </div>
        </div>
    </div>
);