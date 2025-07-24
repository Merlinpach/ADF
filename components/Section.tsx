import React from 'react';
import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export const Section: React.FC<SectionProps> = ({ id, title, children }) => {
  return (
    <section id={id} className="py-16 md:py-24 scroll-mt-20 border-b border-stone-200 last:border-b-0">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-8 pb-3 border-b-2 border-lime-500 inline-block">
          {title}
        </h2>
        <div className="prose prose-lg max-w-none text-stone-700 leading-relaxed space-y-4">
            {children}
        </div>
      </div>
    </section>
  );
};