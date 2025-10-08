import React, { useState, useCallback } from 'react';
import { Language, Script } from './types.ts';
import { generateScript, translateScript } from './services/geminiService.ts';
import Header from './components/Header.tsx';
import TopicInput from './components/TopicInput.tsx';
import LanguageSelector from './components/LanguageSelector.tsx';
import GenerateButton from './components/GenerateButton.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import ErrorDisplay from './components/ErrorDisplay.tsx';
import ScriptDisplay from './components/ScriptDisplay.tsx';

export default function App() {
  const [topic, setTopic] = useState<string>('');
  const [language, setLanguage] = useState<Language>(Language.Hinglish);
  const [script, setScript] = useState<Script | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [translatedScripts, setTranslatedScripts] = useState<Partial<Record<Language, Script>>>({});
  const [isTranslating, setIsTranslating] = useState<Partial<Record<Language, boolean>>>({});

  const handleGenerateScript = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for your script.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setScript(null);
    setTranslatedScripts({});
    try {
      const newScript = await generateScript(topic, language);
      setScript(newScript);
    } catch (e) {
      console.error(e);
      setError('Failed to generate script. The AI might be having a moment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, language]);

  const handleTranslateScript = useCallback(async (targetLanguage: Language) => {
    if (!script) return;

    setIsTranslating(prev => ({ ...prev, [targetLanguage]: true }));
    setError(null);

    try {
        const translatedScript = await translateScript(script, targetLanguage);
        setTranslatedScripts(prev => ({...prev, [targetLanguage]: translatedScript}));
    } catch (e) {
        console.error(e);
        setError(`Failed to translate to ${targetLanguage}. Please try again.`);
    } finally {
        setIsTranslating(prev => ({ ...prev, [targetLanguage]: false }));
    }
  }, [script]);

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl space-y-6 border border-gray-700">
            <TopicInput value={topic} onChange={setTopic} />
            <LanguageSelector selectedLanguage={language} onLanguageChange={setLanguage} />
            <GenerateButton onClick={handleGenerateScript} isLoading={isLoading} />
          </div>

          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}
            {script && (
              <ScriptDisplay 
                script={script} 
                originalLanguage={language}
                translatedScripts={translatedScripts}
                onTranslate={handleTranslateScript}
                isTranslating={isTranslating}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}