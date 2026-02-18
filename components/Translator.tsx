
import React, { useState, useEffect, useCallback } from 'react';
import { translateText } from '../services/gemini';
import { AppLanguage, DICTIONARY, TranslationEntry } from '../types';
import PronunciationButton from './PronunciationButton';
import './Translator.css';

interface TranslatorProps {
  appLang: AppLanguage;
  darkMode: boolean;
  onSave: (entry: Omit<TranslationEntry, 'id' | 'timestamp'>) => void;
}

const Translator: React.FC<TranslatorProps> = ({ appLang, darkMode, onSave }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [definition, setDefinition] = useState('');
  const [sourceLang, setSourceLang] = useState('French');
  const [targetLang, setTargetLang] = useState('Persian');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const t = (key: string) => DICTIONARY[key]?.[appLang] || key;

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      setDefinition('');
      return;
    }
    setIsLoading(true);
    setIsSaved(false);
    const result = await translateText(sourceText, sourceLang, targetLang);
    setTranslatedText(result.translation);
    setDefinition(result.definition);
    setIsLoading(false);
  }, [sourceText, sourceLang, targetLang]);

  useEffect(() => {
    const timer = setTimeout(() => handleTranslate(), 800);
    return () => clearTimeout(timer);
  }, [handleTranslate]);

  const swap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const isRtl = (lang: string) => lang === 'Persian';

  return (
    <div className="translator-container animate-fade-in">
      <div className="translator-main">
        <div className="translate-box source-box">
          <div className="lang-select-header">
            <span className="lang-chip">{sourceLang}</span>
            <PronunciationButton text={sourceText} size="sm" />
          </div>
          <textarea
            className={`input-field ${isRtl(sourceLang) ? 'rtl' : ''}`}
            placeholder={t('sourcePlaceholder')}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
          />
        </div>

        <div className="swap-btn-container">
          <button onClick={swap} className="swap-circle-btn" aria-label="Swap languages">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        <div className="translate-box target-box">
          <div className="lang-select-header">
            <span className="lang-chip">{targetLang}</span>
            <PronunciationButton text={translatedText} size="sm" />
          </div>
          {isLoading ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="animate-spin h-10 w-10 border-4 border-indigo-900 dark:border-indigo-400 border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              <textarea
                readOnly
                className={`input-field font-bold ${isRtl(targetLang) ? 'rtl text-indigo-900 dark:text-indigo-400' : 'text-indigo-900 dark:text-indigo-400'}`}
                placeholder={t('translationPlaceholder')}
                value={translatedText}
              />
              {definition && (
                <div className="definition-card animate-fade-in">
                  <span className="definition-label">{t('definition')}</span>
                  <p className={`italic leading-relaxed ${isRtl(targetLang) ? 'rtl' : ''}`}>{definition}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="action-bar">
        <button
          onClick={() => {
            onSave({ sourceText, translatedText, sourceLang, targetLang, definition });
            setIsSaved(true);
          }}
          disabled={!translatedText || isSaved}
          className={`save-button transition-all duration-300 ${
            isSaved ? 'bg-emerald-600 text-white' : 'bg-indigo-900 dark:bg-indigo-600 text-white active:scale-95'
          } ${!translatedText ? 'opacity-20 grayscale cursor-not-allowed shadow-none' : ''}`}
        >
          {isSaved ? t('saved') : t('save')}
        </button>
      </div>
    </div>
  );
};

export default Translator;