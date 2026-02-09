'use client'
import { createContext, useState, useEffect } from "react";
import { apiService } from '@/services/api';
import { getCookieAuthToken } from '@/app/lib/auth';

interface ExperienceData {
  title: string;
  experience: string;
  pildoras: string[];
  reflection: string;
  story_valuable: string;
  rawInterviewText: string;
  visibility: string;
}

interface PromptData {
  interviewerPromp: string;
  editorPrompt: string;
}

interface UserInfo {
  id: string;
  fullName: string;
  pictureUrl: string;
  username: string;
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
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo | null) => void;
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
  userInfo: null,
  setUserInfo: () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [experienceData, setExperienceData] = useState<ExperienceData | null>(null);
  const [promptData, setPromptData] = useState<PromptData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const fetchPromptData = async (communityId?: string) => {
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

  // Initialize auth on mount
  const initializeAuth = async () => {
    const { token: authToken, userInfo: authUserInfo } = await getCookieAuthToken();
    setToken(authToken);
    setUserInfo(authUserInfo);
  };

  useEffect(() => {
    if (!promptData) {
      fetchPromptData();
    }
  }, [promptData]);

  useEffect(() => {
    initializeAuth();
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
      fetchPromptData,
      userInfo,
      setUserInfo,
    }}>
      {children}
    </AppContext.Provider>
  );
};
