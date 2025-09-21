
import React from 'react';
import { KeyIcon } from './icons/KeyIcon';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  isPreconfigured: boolean;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey, isPreconfigured }) => {
  return (
    <div>
      <label htmlFor="apiKey" className="block text-sm font-medium text-slate-600 mb-1">
        Gemini API Key
        {isPreconfigured && <span className="text-xs text-slate-500 font-normal"> (Optional - pre-configured)</span>}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <KeyIcon />
        </div>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={isPreconfigured ? "Override pre-configured key (optional)" : "Enter your Gemini API key"}
          className="block w-full rounded-md border-slate-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 text-slate-900 placeholder:text-slate-400"
          aria-label="Gemini API Key"
        />
      </div>
       <p className="mt-1 text-xs text-slate-500">
        {isPreconfigured
          ? "Provide your own key to override the application's default key for this session."
          : "Your key is used only for this session and is not stored."
        }
       </p>
    </div>
  );
};
