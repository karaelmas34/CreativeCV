
import React, { useState, useRef } from 'react';
import { parseCVWithAI } from '../../services';
import type { CVData } from '../../types';
import { useTranslations } from '../../i18n';
import { Icon } from './Icon';

// HACK: Make mammoth and pdfjsLib globally available from window
declare const mammoth: any;
declare const pdfjsLib: any;

export const CVUploader: React.FC<{ onCVParseSuccess: (data: Partial<CVData>) => void, userEmail: string }> = ({ onCVParseSuccess, userEmail }) => {
    const { t } = useTranslations();
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = async (file: File) => {
        if (!file) return;
        setIsParsing(true);
        setError(null);
        try {
            if (file.type === 'application/pdf') {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
                    const pdf = await pdfjsLib.getDocument(typedArray).promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        fullText += content.items.map((item: any) => item.str).join(' ');
                    }
                    triggerAIParse(fullText);
                };
                reader.readAsArrayBuffer(file);
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = result.value;
                    
                    const text = tempDiv.innerText || tempDiv.textContent || '';
                    
                    const imgElement = tempDiv.querySelector('img');
                    const imgSrc = imgElement ? imgElement.src : null;
                    
                    triggerAIParse(text, imgSrc);
                };
                reader.readAsArrayBuffer(file);
            } else {
                throw new Error('Unsupported file type');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setIsParsing(false);
        }
    };
    
    const triggerAIParse = async (text: string, imgSrc: string | null = null) => {
        try {
            const parsedData = await parseCVWithAI(text);
            
            if (imgSrc) {
                if (!parsedData.personalInfo) {
                    parsedData.personalInfo = {
                        fullName: '', email: '', phoneNumber: '', address: '',
                        linkedin: '', github: '', website: '', profilePicture: ''
                    };
                }
                parsedData.personalInfo.profilePicture = imgSrc;
            }

            onCVParseSuccess(parsedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsParsing(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };

    return (
        <div className="mt-10">
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-light-bg dark:bg-dark-bg px-2 text-sm text-gray-500">{t('dashboard.importCV')}</span>
                </div>
            </div>
            <div 
              className={`mt-4 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-600 hover:border-primary'}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                {isParsing ? (
                    <div>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-sm text-gray-500">{t('dashboard.importParsing')}</p>
                    </div>
                ) : (
                    <div>
                        <Icon icon="fa-solid fa-cloud-arrow-up" className="text-4xl text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">{t('dashboard.importDropzone')}</p>
                    </div>
                )}
                {error && <p className="mt-2 text-sm text-red-500">{t('dashboard.importError')} {error}</p>}
            </div>
        </div>
    );
};
