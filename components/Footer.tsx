import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800">
      <div className="container mx-auto px-4 py-6 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} BrandSpark Domain Analyzer. All rights reserved.</p>
      </div>
    </footer>
  );
};
