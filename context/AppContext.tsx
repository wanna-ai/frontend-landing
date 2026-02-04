'use client'
import { createContext, useState, useEffect } from "react";
import { apiService } from '@/services/api';

interface ExperienceData {
  title: string;
  experience: string;
  pildoras: string[];
  reflection: string;
  story_valuable: string;
  rawInterviewText: string;
}

interface PromptData {
  interviewerPromp: string;
  editorPrompt: string;
}

interface ContextData {
  experienceData: ExperienceData | null;
  setExperienceData: (experienceData: ExperienceData | null) => void;  
  promptData: PromptData | null;
  setPromptData: (promptData: PromptData | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  postId: string | null;
  setPostId: (postId: string | null) => void;
  isLoadingPrompts: boolean;
  fetchPromptData: (communityId?: string) => Promise<void>;
}

export const AppContext = createContext<ContextData>({
  experienceData: null,
  setExperienceData: () => {},
  promptData: null,
  setPromptData: () => {},
  token: null,
  setToken: () => {},
  postId: null,
  setPostId: () => {},
  isLoadingPrompts: false,
  fetchPromptData: async () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [experienceData, setExperienceData] = useState<ExperienceData | null>(null);
  const [promptData, setPromptData] = useState<PromptData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState<boolean>(false);

  // Función para fetchear los prompts
  const fetchPromptData = async (communityId?: string) => {
    // Si ya tenemos los datos, no hacer fetch de nuevo
    if (promptData?.interviewerPromp && promptData?.editorPrompt) {
      return;
    }

    setIsLoadingPrompts(true);
    try {
      const endpoint = communityId 
        ? `/api/v1/landing/${communityId}/interview-ai-configs` 
        : `/api/v1/landing/interview-ai-configs/default`;
      
      const data = await apiService.get(endpoint);
      
      setPromptData({ 
        interviewerPromp: data.interviewerPromp, 
        editorPrompt: data.editorPromp 
      });
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  // Opcional: Cargar prompts default al montar el provider
  useEffect(() => {
    if (!promptData) {
      fetchPromptData();
    }
  }, []);
  
  return (
    <AppContext.Provider value={{ 
      experienceData, 
      setExperienceData, 
      promptData, 
      setPromptData, 
      token, 
      setToken, 
      postId, 
      setPostId,
      isLoadingPrompts,
      fetchPromptData
    }}>
      {children}
    </AppContext.Provider>
  );
};