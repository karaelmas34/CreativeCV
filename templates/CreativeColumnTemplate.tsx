import React from 'react';
import type { TemplateProps } from './common';

// Template 3: Creative Column
export const CreativeColumnTemplate: React.FC<TemplateProps> = ({ cvData, primaryColor = '#10b981' }) => (
  <div className="bg-gray-100 p-8 grid grid-cols-12 gap-8 font-sans">
    <div className="col-span-4" style={{ backgroundColor: primaryColor }}>
      <div className="p-6 text-white">
        {cvData.personalInfo.profilePicture && 
            <img src={cvData.personalInfo.profilePicture} alt={cvData.personalInfo.fullName} className="rounded-full w-40 h-40 mx-auto mb-6 object-cover border-4 border-white" />
        }
        <h2 className="text-xl font-bold uppercase tracking-wider mt-6">İletişim</h2>
        <div className="border-t border-white/50 my-2"></div>
        <p className="text-sm mb-1">{cvData.personalInfo.email}</p>
        <p className="text-sm mb-1">{cvData.personalInfo.phoneNumber}</p>
        <p className="text-sm">{cvData.personalInfo.address}</p>

        <h2 className="text-xl font-bold uppercase tracking-wider mt-6">Yetenekler</h2>
        <div className="border-t border-white/50 my-2"></div>
        <ul className="list-disc list-inside text-sm">
          {cvData.skills.map(skill => <li key={skill.id}>{skill.name}</li>)}
        </ul>

        {cvData.hobbies && cvData.hobbies.length > 0 && (
            <>
                <h2 className="text-xl font-bold uppercase tracking-wider mt-6">Hobiler</h2>
                <div className="border-t border-white/50 my-2"></div>
                <ul className="list-disc list-inside text-sm">
                  {cvData.hobbies.map(hobby => <li key={hobby.id}>{hobby.name}</li>)}
                </ul>
            </>
        )}
      </div>
    </div>
    <div className="col-span-8 bg-white p-6">
      <h1 className="text-5xl font-extrabold" style={{ color: primaryColor }}>{cvData.personalInfo.fullName}</h1>
      <p className="text-lg font-light text-gray-600 mt-1">{cvData.experience[0]?.title || 'Profesyonel'}</p>
      
      <h2 className="text-2xl font-bold mt-8 border-b-2 pb-1" style={{ borderColor: primaryColor }}>Özet</h2>
      <p className="text-gray-700 text-sm mt-3">{cvData.summary}</p>

      <h2 className="text-2xl font-bold mt-8 border-b-2 pb-1" style={{ borderColor: primaryColor }}>Eğitim</h2>
      {cvData.education.map(edu => (
        <div key={edu.id} className="mt-4">
          <h3 className="text-lg font-semibold">{edu.institution}</h3>
          <p className="text-sm font-medium" style={{ color: primaryColor }}>{edu.degree}</p>
          <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
        </div>
      ))}

      <h2 className="text-2xl font-bold mt-8 border-b-2 pb-1" style={{ borderColor: primaryColor }}>Deneyim</h2>
      {cvData.experience.map(exp => (
        <div key={exp.id} className="mt-4">
          <h3 className="text-lg font-semibold">{exp.title}</h3>
          <p className="text-sm font-medium" style={{ color: primaryColor }}>{exp.company} ({exp.startDate} - {exp.endDate})</p>
          <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
        </div>
      ))}

      {cvData.certificates && cvData.certificates.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mt-8 border-b-2 pb-1" style={{ borderColor: primaryColor }}>Sertifikalar</h2>
            {cvData.certificates.map(cert => (
                <div key={cert.id} className="mt-4">
                    <h3 className="text-lg font-semibold">{cert.name}</h3>
                    <p className="text-sm font-medium" style={{ color: primaryColor }}>{cert.issuer} ({cert.date})</p>
                </div>
            ))}
          </>
      )}
    </div>
  </div>
);