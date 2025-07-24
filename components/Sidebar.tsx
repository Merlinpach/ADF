import React from 'react';
import type { SectionData } from '../types';
import { CloseIcon, LanguageIcon, ChevronDownIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  sections: SectionData[];
  activeSection: string;
  onLinkClick: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const languages: { code: string, name: string }[] = [
    { code: 'he', name: 'עברית' },
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
    { code: 'am', name: 'አማርኛ' },
];

export const Sidebar: React.FC<SidebarProps> = ({ sections, activeSection, onLinkClick, isOpen, setIsOpen }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      <aside className={`fixed top-0 h-full w-64 bg-green-800 text-white shadow-lg flex flex-col z-40 transform transition-transform duration-300 ease-in-out
                       ltr:left-0 rtl:right-0
                       lg:transform-none 
                       ${isOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}`}>
        <div className="p-6 border-b border-green-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-center flex-1">{t('sidebar.title')}</h2>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-white hover:text-lime-300" aria-label={t('sidebar.closeMenuAria')}>
              <CloseIcon />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {/* Intro Link */}
            <li>
              <a
                href="#intro"
                onClick={(e) => {
                    e.preventDefault();
                    onLinkClick('intro');
                }}
                className={`flex items-center py-3 px-6 text-lg transition-colors duration-200 ease-in-out hover:bg-green-700 ${activeSection === 'intro' ? 'bg-lime-600 font-bold' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rtl:ml-3 ltr:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span>{t('sidebar.intro')}</span>
              </a>
            </li>
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onLinkClick(section.id);
                  }}
                  className={`flex items-center py-3 px-6 text-lg transition-colors duration-200 ease-in-out hover:bg-green-700 ${activeSection === section.id ? 'bg-lime-600 font-bold' : ''}`}
                >
                  <span className="w-6 h-6 rtl:ml-3 ltr:mr-3 flex items-center justify-center">{section.icon}</span>
                  <span>{section.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-green-700">
            <label htmlFor="language-select" className="sr-only">{t('sidebar.languageSelectLabel')}</label>
            <div className="relative text-white">
                <span className="absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center px-2 pointer-events-none">
                    <LanguageIcon />
                </span>
                <select 
                    id="language-select"
                    value={language}
                    onChange={handleLanguageChange}
                    className="w-full bg-green-700 border border-green-600 rounded-md py-2 ltr:pl-8 rtl:pr-8 ltr:pr-3 rtl:pl-3 appearance-none focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
                <span className="absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center px-2 pointer-events-none">
                    <ChevronDownIcon />
                </span>
            </div>
        </div>
      </aside>
    </>
  );
};