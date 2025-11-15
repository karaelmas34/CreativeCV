import React from 'react';
import type { TemplateProps } from './common';

// Template 10: Sidebar Nav
export const SidebarNavTemplate: React.FC<TemplateProps> = ({ cvData, primaryColor = '#ef4444' }) => (
    <div className="flex min-h-full font-sans">
        <aside className="w-1/4 p-8 text-white flex-shrink-0" style={{backgroundColor: primaryColor}}>
            {cvData.personalInfo.profilePicture &&
                <img src={cvData.personalInfo.profilePicture} alt={cvData.personalInfo.fullName} className="w-24 h-24 rounded-full mb-4 object-cover" />
            }
            <h1 className="text-3xl font-bold">{cvData.personalInfo.fullName}</h1>
            <p className="text-sm opacity-90">{cvData.experience[0]?.title}</p>
            <nav className="mt-8 space-y-2">
                <a href="#summary" className="block text-lg hover:underline">Özet</a>
                <a href="#experience" className="block text-lg hover:underline">Deneyim</a>
                <a href="#education" className="block text-lg hover:underline">Eğitim</a>
                <a href="#skills" className="block text-lg hover:underline">Yetenekler</a>
                {cvData.projects && cvData.projects.length > 0 && <a href="#projects" className="block text-lg hover:underline">Projeler</a>}
                {cvData.certificates && cvData.certificates.length > 0 && <a href="#certificates" className="block text-lg hover:underline">Sertifikalar</a>}
                <a href="#contact" className="block text-lg hover:underline">İletişim</a>
            </nav>
        </aside>
        <main className="w-3/4 p-12 bg-white text-gray-800">
            <section id="summary" className="mb-10">
                <h2 className="text-3xl font-bold border-b-2 pb-2 mb-4" style={{borderColor: primaryColor}}>Özet</h2>
                <p className="text-gray-700">{cvData.summary}</p>
            </section>
             <section id="experience" className="mb-10">
                <h2 className="text-3xl font-bold border-b-2 pb-2 mb-4" style={{borderColor: primaryColor}}>Deneyim</h2>
                 {cvData.experience.map(exp => (
                    <div key={exp.id} className="mb-4">
                        <h3 className="text-lg font-semibold">{exp.title} - {exp.company}</h3>
                        <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
                        <p className="text-gray-700 mt-1">{exp.description}</p>
                    </div>
                ))}
            </section>
            <section id="education" className="mb-10">
                <h2 className="text-3xl font-bold border-b-2 pb-2 mb-4" style={{borderColor: primaryColor}}>Eğitim</h2>
                 {cvData.education.map(edu => (
                    <div key={edu.id} className="mb-4">
                        <h3 className="text-lg font-semibold">{edu.institution}</h3>
                        <p className="text-sm text-gray-600">{edu.degree}, {edu.fieldOfStudy}</p>
                    </div>
                ))}
            </section>
            <section id="skills" className="mb-10">
                <h2 className="text-3xl font-bold border-b-2 pb-2 mb-4" style={{borderColor: primaryColor}}>Yetenekler</h2>
                <div className="grid grid-cols-2 gap-4">
                    {cvData.skills.map(s => <p key={s.id} className="font-medium">{s.name}</p>)}
                </div>
            </section>
            {cvData.projects && cvData.projects.length > 0 && (
                <section id="projects" className="mb-10">
                    <h2 className="text-3xl font-bold border-b-2 pb-2 mb-4" style={{borderColor: primaryColor}}>Projeler</h2>
                    {cvData.projects.map(proj => (
                       <div key={proj.id} className="mb-4">
                           <h3 className="text-lg font-semibold">{proj.name}</h3>
                           <p className="text-gray-700 mt-1">{proj.description}</p>
                       </div>
                   ))}
                </section>
            )}
            {cvData.certificates && cvData.certificates.length > 0 && (
                <section id="certificates" className="mb-10">
                    <h2 className="text-3xl font-bold border-b-2 pb-2 mb-4" style={{borderColor: primaryColor}}>Sertifikalar</h2>
                    {cvData.certificates.map(cert => (
                       <div key={cert.id} className="mb-4">
                           <h3 className="text-lg font-semibold">{cert.name}</h3>
                           <p className="text-sm text-gray-600">{cert.issuer}, {cert.date}</p>
                       </div>
                   ))}
                </section>
            )}
            <section id="contact" className="mb-10">
                <h2 className="text-3xl font-bold border-b-2 pb-2 mb-4" style={{borderColor: primaryColor}}>İletişim</h2>
                <p>{cvData.personalInfo.email}</p>
                <p>{cvData.personalInfo.phoneNumber}</p>
                <p>{cvData.personalInfo.address}</p>
            </section>
        </main>
    </div>
);