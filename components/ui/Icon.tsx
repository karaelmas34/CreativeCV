
import React from 'react';

export const Icon: React.FC<{ icon: string; className?: string, style?: React.CSSProperties }> = ({ icon, className, style }) => (
  <i className={`${icon} ${className}`} style={style}></i>
);
