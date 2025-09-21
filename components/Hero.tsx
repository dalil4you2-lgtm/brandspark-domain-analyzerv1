import React from 'react';

interface HeroProps {
  onGetStartedClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStartedClick }) => {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight">
          Instantly Analyze the Investment Potential of Any Domain
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-slate-600">
          Leverage Google's Gemini AI to get expert-level analysis on brandability, market value, and premium marketplace acceptance potential for your domain names.
        </p>
        <div className="mt-10">
          <button
            onClick={onGetStartedClick}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Analyzing Now
          </button>
        </div>
      </div>
    </section>
  );
};
