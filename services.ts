import { GoogleGenAI, Type } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import type { CVData } from './types';


// IMPORTANT: The API key is injected from environment variables.
// Do not add any UI to ask for it.
let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

const prompts = {
  tr: (text: string) => `Aşağıdaki metni bir özgeçmiş için daha profesyonel, etkili ve eylem fiilleri kullanarak yeniden yaz. Sadece yeniden yazılmış metni döndür, başka hiçbir açıklama ekleme:\n\n"${text}"`,
  en: (text: string) => `Rewrite the following text for a resume to be more professional, effective, and use action verbs. Return only the rewritten text, do not add any other explanation:\n\n"${text}"`
};


export const enhanceTextWithAI = async (text: string, lang: 'tr' | 'en' = 'tr'): Promise<string> => {
  if (!ai) {
    throw new Error("Gemini API key not configured.");
  }
  if (!text.trim()) {
    return "";
  }
  try {
    const prompt = prompts[lang](text);
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    const errorMessages = {
        tr: "Metin yapay zeka ile geliştirilirken bir hata oluştu.",
        en: "An error occurred while enhancing text with AI."
    };
    console.error("Error enhancing text with AI:", error);
    throw new Error(errorMessages[lang]);
  }
};

const cvSchema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        email: { type: Type.STRING },
        phoneNumber: { type: Type.STRING },
        address: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        github: { type: Type.STRING },
        website: { type: Type.STRING },
      },
    },
    summary: { type: Type.STRING },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING, description: "Year and month, e.g., 2022-01" },
          endDate: { type: Type.STRING, description: "Year and month, e.g., 2023-12 or 'Present'" },
          description: { type: Type.STRING },
        },
        required: ['title', 'company', 'startDate', 'endDate', 'description']
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          fieldOfStudy: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
        },
         required: ['institution', 'degree', 'startDate', 'endDate']
      },
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          level: { type: Type.INTEGER, description: "A number from 1 to 5 representing skill level." },
        },
        required: ['name']
      },
    },
    languages: {
       type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          proficiency: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native'] },
        },
         required: ['name', 'proficiency']
      },
    },
    certificates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          issuer: { type: Type.STRING },
          date: { type: Type.STRING, description: "Year and month, e.g., 2023-05" },
        },
        required: ['name', 'issuer']
      }
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          link: { type: Type.STRING },
        },
        required: ['name', 'description']
      }
    },
    references: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          relation: { type: Type.STRING },
          contact: { type: Type.STRING },
        },
        required: ['name']
      }
    },
    hobbies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
        },
        required: ['name']
      }
    }
  },
};

export const parseCVWithAI = async (cvText: string): Promise<Partial<CVData>> => {
    if (!ai) {
        throw new Error("Gemini API key not configured.");
    }
    if (!cvText.trim()) {
        throw new Error("CV text is empty.");
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Aşağıda bir CV'den çıkarılmış metin bulunmaktadır. Bu metni analiz et ve bilgilerini sağlanan JSON şemasına göre yapılandır. Eksik alanları boş bırak. Çıktı sadece ve sadece JSON nesnesi olmalı, başka hiçbir metin veya işaretleme içermemeli.\n\nCV Metni:\n"""\n${cvText}\n"""`,
            config: {
                responseMimeType: "application/json",
                responseSchema: cvSchema,
            },
        });

        const jsonString = response.text;
        const parsedData = JSON.parse(jsonString);
        
        // Ensure arrays exist even if AI doesn't return them
        const sanitizedData = {
          ...parsedData,
          experience: parsedData.experience || [],
          education: parsedData.education || [],
          skills: parsedData.skills || [],
          languages: parsedData.languages || [],
          certificates: parsedData.certificates || [],
          projects: parsedData.projects || [],
          references: parsedData.references || [],
          hobbies: parsedData.hobbies || [],
        };

        return sanitizedData as Partial<CVData>;

    } catch (error) {
        console.error("Error parsing CV with AI:", error);
        throw new Error("Yapay zeka CV'yi ayrıştırırken bir hata oluştu. Lütfen metnin geçerli bir CV içeriği olduğundan emin olun.");
    }
};