'use client'
import { createContext, useState, Dispatch, SetStateAction } from "react";

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
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [experienceData, setExperienceData] = useState<{ title: string; experience: string; pildoras: string[]; reflection: string; story_valuable: string; rawInterviewText: string } | null>(null);
  const [promptData, setPromptData] = useState<PromptData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  
  return (
    <AppContext.Provider value={{ experienceData, setExperienceData, promptData, setPromptData, token, setToken, postId, setPostId }}>
      {children}
    </AppContext.Provider>
  );
};