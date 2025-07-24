import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { ChatMessage } from '../types';
import { ChatIcon, CloseIcon, SendIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

const API_KEY = process.env.API_KEY;

declare const marked: {
  parse(markdown: string): string;
};

const stripHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

export const ChatAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { language, t, translations } = useLanguage();

    useEffect(() => {
        if (!API_KEY || !translations || !Object.keys(translations).length) {
            setChat(null);
            return;
        }

        const getHandbookText = () => {
            if (!translations.sections) return "";
            return Object.keys(translations.sections).map(sectionId => {
                const section = translations.sections[sectionId];
                const content = stripHtml(section.content);
                return `### ${section.title}\n${content}`;
            }).join('\n\n---\n\n');
        };

        const handbookContext = getHandbookText();
        if (!handbookContext) return;

        const systemInstruction = t('chat.systemInstruction', { handbookContext });

        try {
            const ai = new GoogleGenAI({ apiKey: API_KEY });
            const chatSession = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction },
            });
            setChat(chatSession);
            setMessages([]); 
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI:", error);
            setChat(null);
        }
    }, [language, translations, t]);
    
    useEffect(() => {
       if (isOpen) {
         document.body.style.overflow = 'hidden';
       } else {
         document.body.style.overflow = 'unset';
       }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chat || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: input });
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('Error sending message to Gemini:', error);
            setMessages(prev => [...prev, { role: 'model', text: t('chat.error') }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!API_KEY) {
      return null;
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 z-20 p-4 bg-lime-600 text-white rounded-full shadow-lg hover:bg-lime-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500
                           rtl:left-5 ltr:right-5"
                aria-label={t('chat.openAria')}
            >
                <ChatIcon />
            </button>

            <div
                className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)}></div>

                <div
                     className={`absolute bottom-0 bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full h-[85%] md:h-[70vh] md:w-[440px] flex flex-col transform transition-transform duration-300 ease-out 
                                md:bottom-5 md:rtl:left-5 md:ltr:right-5 
                                ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                >
                    <header className="flex items-center justify-between p-4 border-b border-stone-200 flex-shrink-0">
                        <h3 className="text-xl font-bold text-green-800">{t('chat.title')}</h3>
                        <button onClick={() => setIsOpen(false)} className="p-2 text-stone-500 hover:text-stone-800" aria-label={t('common.closeAria')}>
                            <CloseIcon />
                        </button>
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-4">
                             <div className="flex justify-start">
                                <div className="bg-lime-100 text-green-900 rounded-2xl ltr:rounded-bl-lg rtl:rounded-br-lg p-3 max-w-sm">
                                    <p>{t('chat.welcome')}</p>
                                </div>
                            </div>
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`rounded-2xl p-3 max-w-sm prose prose-sm ${msg.role === 'user' ? 'bg-green-700 text-white ltr:rounded-br-lg rtl:rounded-bl-lg' : 'bg-stone-200 text-stone-800 ltr:rounded-bl-lg rtl:rounded-br-lg'}`}
                                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
                                    ></div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-stone-200 rounded-2xl ltr:rounded-bl-lg rtl:rounded-br-lg p-3">
                                        <div className="flex items-center space-x-1 rtl:space-x-reverse" dir="ltr">
                                            <span className="w-2 h-2 bg-stone-400 rounded-full animate-pulse"></span>
                                            <span className="w-2 h-2 bg-stone-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                            <span className="w-2 h-2 bg-stone-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                             <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <footer className="p-4 border-t border-stone-200 flex-shrink-0">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 rtl:space-x-reverse">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={t('chat.placeholder')}
                                className="flex-1 w-full px-4 py-2 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-500"
                                disabled={isLoading || !chat}
                                aria-label={t('chat.messageAria')}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim() || !chat}
                                className="p-3 bg-green-700 text-white rounded-full hover:bg-green-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                                aria-label={t('chat.sendAria')}
                            >
                                <SendIcon />
                            </button>
                        </form>
                    </footer>
                </div>
            </div>
        </>
    );
};