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

  // Function to get user info
  const getUserInfo = async (token: string) => {
    const userInfoResponse = await apiService.get('/api/v1/users/me', { token: token })
    console.log('userInfoResponse', userInfoResponse)

    if (userInfoResponse) {

      if (userInfoResponse.username.startsWith('guest-')) {
        await fetch('/api/auth/remove-cookie-token', {
          method: 'POST',
          credentials: 'include',
        })
        setToken(null)
        setUserInfo(null)
        return
      }

      setUserInfo(userInfoResponse)
    }
  }

  // Function to get cookie authToken
  const getCookieAuthToken = async () => {
    const tokenResponse = await fetch('/api/auth/get-cookie', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const tokenData = await tokenResponse.json()
    console.log('tokenData', tokenData)

    if (tokenData.token) {
      setToken(tokenData.token)
      getUserInfo(tokenData.token);
    }

    const token = tokenData.token
    setToken(token)
  }

  useEffect(() => {
    if (!promptData) {
      fetchPromptData();
    }
  }, [ promptData ]);

  useEffect(() => {
    getCookieAuthToken();
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