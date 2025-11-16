
import React, { useRef, useEffect } from 'react';
import type { CVData, Template } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

export const CVPreview = React.memo(({ cvData, primaryColor, templates, selectedTemplate, previewMode }: {
    cvData: CVData,
    primaryColor: string,
    templates: Template[],
    selectedTemplate: string,
    previewMode: 'desktop' | 'mobile'
}) => {
    const cvPreviewRef = useRef<HTMLDivElement>(null);
    const debouncedCvData = useDebounce(cvData, 500);
    const TemplateComponent = templates.find(t => t.id === selectedTemplate)?.component;

    // This effect handles the print logic and needs access to the debounced data
    useEffect(() => {
        const handlePrint = () => {
             const printContent = cvPreviewRef.current;
             if (printContent) {
                const printWindow = window.open('', '', 'height=800,width=800');
                if (printWindow) {
                    printWindow.document.write('<html><head><title>CV</title>');
                    printWindow.document.write('<script src="https://cdn.tailwindcss.com"><\/script>');
                    printWindow.document.write('<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">');
                    printWindow.document.write('<style>@media print { body { -webkit-print-color-adjust: exact; } } .a4-container { width: 210mm; min-height: 297mm; } </style>');
                    printWindow.document.write('</head><body>');
                    printWindow.document.write('<div class="a4-container">');
                    printWindow.document.write(printContent.innerHTML);
                    printWindow.document.write('</div>');
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    setTimeout(() => {
                        printWindow.print();
                        printWindow.close();
                    }, 500);
                }
            }
        };

        window.addEventListener('execute-print', handlePrint);
        return () => window.removeEventListener('execute-print', handlePrint);
    }, []); // This effect runs once to set up the listener

    return (
        <main className="flex-1 h-full w-full overflow-y-auto bg-gray-200 dark:bg-gray-900 p-4 md:p-8 flex items-start justify-center">
            <div 
              ref={cvPreviewRef} 
              className={`mx-auto shadow-2xl transition-all duration-500 ease-in-out transform-gpu 
                ${previewMode === 'desktop' 
                    ? 'w-[210mm] min-h-[297mm]' 
                    : 'w-[375px] h-[667px] rounded-[30px] border-[10px] border-gray-800 dark:border-gray-600 overflow-y-auto'
                }`}
            >
                {TemplateComponent && <TemplateComponent cvData={debouncedCvData} primaryColor={primaryColor} />}
            </div>
        </main>
    );
});
