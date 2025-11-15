// Fix: Import React to use React.FC type.
import type React from 'react';

export interface Skill {
  id: string;
  name:string;
  level: number; // 1-5
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id:string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export interface Reference {
  id: string;
  name: string;
  relation: string;
  contact: string;
}

export interface Hobby {
  id: string;
  name: string;
}

export interface CVData {
  id: string;
  userEmail: string; // Added for admin panel tracking
  title: string;
  personalInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    linkedin: string;
    github: string;
    website: string;
    profilePicture: string; // Base64 or URL
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certificates?: Certificate[];
  projects?: Project[];
  references?: Reference[];
  hobbies?: Hobby[];
  createdAt: string; // Added for admin panel tracking
  lastUpdated: string;
}

export interface Template {
  id: string;
  name: string;
  component: React.FC<{ cvData: CVData; primaryColor?: string; }>;
}

export type Page = 'home' | 'login' | 'dashboard' | 'editor' | 'admin' | 'templates' | 'profile' | 'about';

export interface User {
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  joinDate: string; // Added for admin panel tracking
  status: 'active' | 'banned'; // Added for admin ban functionality
}

export interface AdBanner {
  id: string;
  imageUrl: string;
  linkUrl: string;
  placement: 'dashboard' | 'templates';
  isActive: boolean;
}