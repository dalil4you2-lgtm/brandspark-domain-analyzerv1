import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DomainInput } from './components/DomainInput';
import { AnalysisResult } from './components/AnalysisResult';
import { Loader } from './components/Loader';
import { analyzeDomains } from './services/geminiService';
import type { DomainReport } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { ApiProviderSelector } from './components/ApiProviderSelector';

export type ApiProvider = 'gemini' | 'openai';

const App: React.FC = () => {
  const [domains, setDomains] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DomainReport | null>(null);
  const [selectedApi, setSelectedApi] = useState<ApiProvider>('gemini');
  const [apiKey, setApiKey] = useState<string>('');


  const handleAnalyze = useCallback(async () => {
    if (!domains) {
      setError('Please enter at least one domain name.');
      return;
    }
    if (!apiKey) {
      setError(`Please enter an API key for ${selectedApi === 'gemini' ? 'Gemini' : 'OpenAI'}.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeDomains(domains, apiKey, selectedApi);
      setResult(analysisResult);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [domains, apiKey, selectedApi]);

  const isAnalyzeDisabled = isLoading || !domains || !apiKey;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main>
        <section id="analyzer" className="py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight">
                  Instantly Analyze the Investment Potential of Any Domain
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-slate-600">
                  Leverage powerful AI to get expert-level analysis on brandability, market value, and premium marketplace acceptance potential for your domain names.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 space-y-6">
                <ApiProviderSelector 
                  selectedApi={selectedApi}
                  onApiChange={setSelectedApi}
                  apiKey={apiKey}
                  onApiKeyChange={setApiKey}
                />
                
                <DomainInput domains={domains} setDomains={setDomains} />

                <div className="pt-2 text-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzeDisabled}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoading ? (
                      <>
                        <Loader />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <SparklesIcon />
                        Analyze Domains
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-8 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {result && !isLoading && (
                <div className="mt-8">
                  <AnalysisResult report={result} />
                </div>
              )}
            </div>
          </div>
        </section>
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default App;