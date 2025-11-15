import React from 'react';
import type { CVData } from '../types';

export interface TemplateProps {
  cvData: CVData;
  primaryColor?: string;
}

export const Icon: React.FC<{ icon: string; className?: string; style?: React.CSSProperties }> = ({ icon, className, style }) => (
  <i className={`${icon} ${className}`} style={style}></i>
);
