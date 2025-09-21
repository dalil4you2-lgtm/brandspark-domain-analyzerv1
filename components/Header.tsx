import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <LogoIcon />
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          BrandSpark <span className="text-indigo-600">Domain Analyzer</span>
        </h1>
      </div>
    </header>
  );
};
