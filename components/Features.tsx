import React from 'react';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { TargetIcon } from './icons/TargetIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';


const features = [
  {
    name: 'AI-Powered Analysis',
    description: 'Utilizes advanced AI to perform a multi-faceted analysis covering linguistics, marketing value, and technical factors.',
    icon: BrainCircuitIcon,
  },
  {
    name: 'Premium Marketplace Scoring',
    description: 'Get an "Atom Score" to estimate the acceptance probability on premium marketplaces like Atom.com and BrandBucket.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Valuation & Strategy',
    description: 'Receive realistic wholesale and retail price valuations, along with ideal use cases to inform your sales strategy.',
    icon: TrendingUpIcon,
  },
  {
    name: 'Executive Briefing',
    description: 'A concise, ranked list of the top 5 investment-grade domains from your list, with clear justifications for each pick.',
    icon: TargetIcon,
  },
];

export const Features: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">Why Use BrandSpark?</h2>
          <p className="mt-4 text-lg text-slate-600">Make data-driven decisions on your next domain investment.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.name} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <feature.icon />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-800">{feature.name}</h3>
              <p className="mt-2 text-base text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
