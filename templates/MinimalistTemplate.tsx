import React from 'react';
import type { TemplateProps } from './common';

// Template 1: Minimalist
export const MinimalistTemplate: React.FC<TemplateProps> = ({ cvData, primaryColor = '#4f46e5' }) => (
  <div className="bg-white text-gray-800 p-8 font-serif">
    {cvData.personalInfo.profilePicture && (
        <div className="flex justify-center mb-8">
            <img 
                src={cvData.personalInfo.profilePicture} 
                alt={cvData.personalInfo.fullName} 
                className="w-32 h-32 rounded-full object-cover shadow-md"
            />
        </div>
    )}
    <header className="text-center mb-10 border-b-2 pb-6" style={{ borderColor: primaryColor }}>
      <h1 className="text-5xl font-bold tracking-widest" style={{ color: primaryColor }}>{cvData.personalInfo.fullName}</h1>
      <p className="text-lg mt-2">{cvData.personalInfo.email} | {cvData.personalInfo.phoneNumber} | {cvData.personalInfo.address}</p>
      <div className="flex justify-center space-x-4 mt-2 text-sm">
        {cvData.personalInfo.linkedin && <a href={cvData.personalInfo.linkedin}>LinkedIn</a>}
        {cvData.personalInfo.github && <a href={cvData.personalInfo.github}>GitHub</a>}
        {cvData.personalInfo.website && <a href={cvData.personalInfo.website}>Website</a>}
      </div>
    </header>
    <main>
      <section className="mb-8">
        <h2 className="text-2xl font-bold tracking-wider border-b pb-2 mb-4" style={{ color: primaryColor }}>Özet</h2>
        <p className="text-gray-700">{cvData.summary}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold tracking-wider border-b pb-2 mb-4" style={{ color: primaryColor }}>Eğitim</h2>
        {cvData.education.map(edu => (
          <div key={edu.id} className="mb-4">
            <h3 className="text-lg font-semibold">{edu.institution}</h3>
            <p className="text-sm text-gray-600">{edu.degree}, {edu.fieldOfStudy}</p>
            <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
          </div>
        ))}
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold tracking-wider border-b pb-2 mb-4" style={{ color: primaryColor }}>Deneyim</h2>
        {cvData.experience.map(exp => (
          <div key={exp.id} className="mb-4">
            <h3 className="text-lg font-semibold">{exp.title} - {exp.company}</h3>
            <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate} | {exp.location}</p>
            <p className="text-gray-700 mt-1">{exp.description}</p>
          </div>
        ))}
      </section>
       <section className="mb-8">
        <h2 className="text-2xl font-bold tracking-wider border-b pb-2 mb-4" style={{ color: primaryColor }}>Yetenekler</h2>
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map(skill => <span key={skill.id} className="bg-gray-200 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">{skill.name}</span>)}
        </div>
      </section>
       {cvData.projects && cvData.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold tracking-wider border-b pb-2 mb-4" style={{ color: primaryColor }}>Projeler</h2>
            {cvData.projects.map(proj => (
              <div key={proj.id} className="mb-4">
                <h3 className="text-lg font-semibold">{proj.name}</h3>
                {proj.link && <a href={proj.link} className="text-sm text-gray-600" style={{color: primaryColor}}>{proj.link}</a>}
                <p className="text-gray-700 mt-1">{proj.description}</p>
              </div>
            ))}
          </section>
        )}
        {cvData.certificates && cvData.certificates.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold tracking-wider border-b pb-2 mb-4" style={{ color: primaryColor }}>Sertifikalar</h2>
            {cvData.certificates.map(cert => (
              <div key={cert.id} className="mb-4">
                <h3 className="text-lg font-semibold">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.issuer} ({cert.date})</p>
              </div>
            ))}
          </section>
        )}
        {cvData.hobbies && cvData.hobbies.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold tracking-wider border-b pb-2 mb-4" style={{ color: primaryColor }}>Hobiler</h2>
            <div className="flex flex-wrap gap-2">
                {cvData.hobbies.map(hobby => <span key={hobby.id} className="bg-gray-200 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">{hobby.name}</span>)}
            </div>
          </section>
        )}
    </main>
  </div>
);