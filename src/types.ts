import type { ReactNode } from 'react';

export interface SectionRenderHandlers {
  openImageModal: (src: string) => void;
}

export interface SectionData {
  id: string;
  title: string;
  icon: ReactNode;
  content: string; // Content is now a string (HTML) from JSON
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface MapPoint {
  id: number;
  name: string;
  coords: {
    x: number;
    y: number;
  };
}

export interface Translations {
  [key: string]: any;
  mapPoints?: MapPoint[];
}

export interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  translations: Translations;
}