
import type { CVData } from '../types';
import type { TranslationKey } from '../i18n';
import { uuidv4_mock } from './uuid';

export const getInitialCVData = (t: (key: TranslationKey, ...args: any[]) => string, userEmail: string): CVData => ({
    id: uuidv4_mock(),
    userEmail: userEmail,
    title: t('editor.fullName') + ' CV',
    personalInfo: {
        fullName: t('editor.fullName'),
        email: 'email@example.com',
        phoneNumber: '+90 555 123 4567',
        address: 'City, Country',
        linkedin: '', github: '', website: '',
        profilePicture: 'https://picsum.photos/200'
    },
    summary: t('home.subtitle'),
    experience: [{ id: uuidv4_mock(), title: 'Software Developer', company: 'Tech Inc.', location: 'Istanbul', startDate: '2022-01', endDate: 'Present', description: 'Developed modern web applications using React and TypeScript. Worked within the team to improve code quality.' }],
    education: [{ id: uuidv4_mock(), institution: 'University Name', degree: 'Bachelor', fieldOfStudy: 'Computer Engineering', startDate: '2018-09', endDate: '2022-06' }],
    skills: [{id: uuidv4_mock(), name: 'React', level: 4}, {id: uuidv4_mock(), name: 'TypeScript', level: 4}, {id: uuidv4_mock(), name: 'Node.js', level: 3}],
    languages: [{id: uuidv4_mock(), name: 'English', proficiency: 'Advanced'}],
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
});
