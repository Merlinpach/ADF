
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Section } from './components/Section';
import { ChatAssistant } from './components/ChatAssistant';
import { InteractiveMap } from './components/InteractiveMap';
import { SECTION_CONFIG } from './constants';
import type { SectionData } from './types';
import { MenuIcon } from './components/Icons';
import { useLanguage } from './contexts/LanguageContext';




function App() {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t, translations } = useLanguage();

  const SECTIONS: SectionData[] = useMemo(() => {
    if (!translations.sections) return [];
    return SECTION_CONFIG.map(config => ({
      ...config,
      title: t(`sections.${config.id}.title`),
      content: t(`sections.${config.id}.content`),
    }));
  }, [translations, t]);

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -40% 0px', // Trigger when section is near the top
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const currentRefs = sectionRefs.current;
    Object.values(currentRefs).forEach(ref => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      Object.values(currentRefs).forEach(ref => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, []);
  
  const handleLinkClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        const yOffset = -80; // Offset to account for any fixed headers
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
    // Close sidebar on mobile after clicking a link
    if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
    }
  };


  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="flex">
        <Sidebar 
          sections={SECTIONS} 
          activeSection={activeSection} 
          onLinkClick={handleLinkClick}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        
        <main className="flex-1 lg:ltr:ml-64 lg:rtl:mr-64"> 
          <header id="intro" ref={el => { sectionRefs.current['intro'] = el; }} className="bg-cover bg-center min-h-[50vh] flex flex-col items-center justify-center text-white p-8 scroll-mt-20" style={{backgroundImage: "linear-gradient(rgba(20, 44, 2, 0.6), rgba(20, 44, 2, 0.6)), url('https://images.unsplash.com/photo-1560241857-9d4de80a293f?q=80&w=2670&auto=format&fit=crop')"}}>
              <div className="text-center bg-black bg-opacity-40 p-6 md:p-8 rounded-lg shadow-2xl">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">{t('app.title')}</h1>
                <p className="text-xl md:text-2xl mt-4 font-light">{t('app.subtitle')}</p>
              </div>
          </header>

          <div className="px-4 md:px-12 lg:px-20">
            {SECTIONS.map((section: SectionData) => (
              <div key={section.id} ref={el => { sectionRefs.current[section.id] = el; }}>
                  <Section id={section.id} title={section.title}>
                    {section.id === 'mapa' ? (
                       <>
                          <div dangerouslySetInnerHTML={{ __html: section.content }} />
                          <InteractiveMap 
                            imageUrl="assets/idf-map.png"
                            points={translations.mapPoints || []}
                            altText={t('map.alt')}
                          />
                       </>
                    ) : (
                       <div dangerouslySetInnerHTML={{ __html: section.content }} />
                    )}
                  </Section>
              </div>
            ))}
          </div>
          
          <footer className="text-center py-8 bg-green-900 text-green-200 mt-16">
            <p>{t('footer.message')}</p>
            <p className="text-sm opacity-70 mt-2">&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
          </footer>
        </main>
      </div>

      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-5 ltr:left-5 rtl:right-5 z-30 p-2 bg-green-800/80 backdrop-blur-sm text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
        aria-label={t('sidebar.openMenuAria')}
      >
        <MenuIcon />
      </button>

      <ChatAssistant />
    </div>
  );
}

export default App;