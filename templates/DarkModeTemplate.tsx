import React from 'react';
import type { TemplateProps } from './common';

// Template 6: Dark Mode
export const DarkModeTemplate: React.FC<TemplateProps> = ({ cvData, primaryColor = '#ec4899' }) => (
  <div className="bg-[#111827] text-white p-10 font-sans">
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 md:col-span-4">
        {cvData.personalInfo.profilePicture && 
          <img src={cvData.personalInfo.profilePicture} alt={cvData.personalInfo.fullName} className="rounded-lg w-full mb-6 object-cover" />
        }
        <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>İLETİŞİM</h2>
        <div className="w-10 h-1 my-2" style={{ backgroundColor: primaryColor }}></div>
        <p className="text-sm text-gray-300 mb-1">{cvData.personalInfo.email}</p>
        <p className="text-sm text-gray-300 mb-1">{cvData.personalInfo.phoneNumber}</p>
        <p className="text-sm text-gray-300">{cvData.personalInfo.address}</p>

        <h2 className="text-2xl font-bold mt-8" style={{ color: primaryColor }}>YETENEKLER</h2>
        <div className="w-10 h-1 my-2" style={{ backgroundColor: primaryColor }}></div>
        {cvData.skills.map(skill => (
          <div key={skill.id} className="mb-2">
            <span className="text-sm text-gray-300">{skill.name}</span>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
              <div className="h-2 rounded-full" style={{ width: `${skill.level * 20}%`, backgroundColor: primaryColor }}></div>
            </div>
          </div>
        ))}
      </div>
      <div className="col-span-12 md:col-span-8">
        <h1 className="text-6xl font-extrabold">{cvData.personalInfo.fullName}</h1>
        <p className="text-2xl font-light mt-1" style={{ color: primaryColor }}>{cvData.experience[0]?.title || 'Profesyonel'}</p>
        
        <p className="text-gray-300 mt-6">{cvData.summary}</p>
        
        <h2 className="text-3xl font-bold mt-10" style={{ color: primaryColor }}>DENEYİM</h2>
        <div className="border-l-2 pl-6 mt-4" style={{ borderColor: primaryColor }}>
        {cvData.experience.map(exp => (
          <div key={exp.id} className="mb-6 relative">
             <div className="absolute -left-[34px] top-1 w-4 h-4 rounded-full bg-[#111827] border-2" style={{borderColor: primaryColor}}></div>
            <p className="text-xs uppercase" style={{ color: primaryColor }}>{exp.startDate} - {exp.endDate}</p>
            <h3 className="text-xl font-semibold">{exp.title}</h3>
            <p className="text-md text-gray-400">{exp.company}</p>
            <p className="text-sm text-gray-300 mt-1">{exp.description}</p>
          </div>
        ))}
        </div>
        
        <h2 className="text-3xl font-bold mt-10" style={{ color: primaryColor }}>EĞİTİM</h2>
        <div className="border-l-2 pl-6 mt-4" style={{ borderColor: primaryColor }}>
        {cvData.education.map(edu => (
           <div key={edu.id} className="mb-6 relative">
            <div className="absolute -left-[34px] top-1 w-4 h-4 rounded-full bg-[#111827] border-2" style={{borderColor: primaryColor}}></div>
            <p className="text-xs uppercase" style={{ color: primaryColor }}>{edu.startDate} - {edu.endDate}</p>
            <h3 className="text-xl font-semibold">{edu.institution}</h3>
            <p className="text-md text-gray-400">{edu.degree}</p>
          </div>
        ))}
        </div>
        
        {cvData.certificates && cvData.certificates.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mt-10" style={{ color: primaryColor }}>SERTİFİKALAR</h2>
            <div className="border-l-2 pl-6 mt-4" style={{ borderColor: primaryColor }}>
            {cvData.certificates.map(cert => (
              <div key={cert.id} className="mb-6 relative">
                <div className="absolute -left-[34px] top-1 w-4 h-4 rounded-full bg-[#111827] border-2" style={{borderColor: primaryColor}}></div>
                <p className="text-xs uppercase" style={{ color: primaryColor }}>{cert.date}</p>
                <h3 className="text-xl font-semibold">{cert.name}</h3>
                <p className="text-md text-gray-400">{cert.issuer}</p>
              </div>
            ))}
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);