import React from 'react';
import type { ApiProvider } from '../App';
import { KeyIcon } from './icons/KeyIcon';
import { LogoIcon } from './icons/LogoIcon'; // Used for Gemini
import { OpenAIIcon } from './icons/OpenAIIcon';

interface ApiProviderSelectorProps {
  selectedApi: ApiProvider;
  onApiChange: (api: ApiProvider) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const providers = [
  { id: 'gemini', title: 'Google Gemini', icon: LogoIcon },
  { id: 'openai', title: 'OpenAI', icon: OpenAIIcon },
];

export const ApiProviderSelector: React.FC<ApiProviderSelectorProps> = ({
  selectedApi,
  onApiChange,
  apiKey,
  onApiKeyChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-600">AI Provider</label>
        <fieldset className="mt-2">
          <legend className="sr-only">Choose an AI provider</legend>
          <div className="grid grid-cols-2 gap-3">
            {providers.map((provider) => (
              <label
                key={provider.id}
                htmlFor={provider.id}
                className={`relative flex items-center justify-center gap-3 rounded-lg border p-3 text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500
                  ${selectedApi === provider.id ? 'bg-indigo-50 border-indigo-300 text-indigo-900' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
              >
                <input
                  type="radio"
                  id={provider.id}
                  name="api-provider"
                  value={provider.id}
                  checked={selectedApi === provider.id}
                  onChange={() => onApiChange(provider.id as ApiProvider)}
                  className="sr-only"
                  aria-labelledby={`${provider.id}-label`}
                />
                <provider.icon />
                <span id={`${provider.id}-label`}>{provider.title}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div>
        <label htmlFor="api-key" className="block text-sm font-medium text-slate-600 mb-1">
          {selectedApi === 'gemini' ? 'Gemini API Key' : 'OpenAI API Key'}
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <KeyIcon />
          </div>
          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder={`Enter your ${selectedApi === 'gemini' ? 'Gemini' : 'OpenAI'} API key`}
            className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 text-slate-900 placeholder:text-slate-400"
            aria-label={`${selectedApi} API Key`}
          />
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Your key is used only for this session and is not stored.
        </p>
      </div>
    </div>
  );
};