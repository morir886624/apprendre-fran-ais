
import React, { useState } from 'react';
import { AppLanguage, DICTIONARY, TranslationEntry } from '../types';
import PronunciationButton from './PronunciationButton';
import './Learn.css';

interface LearnProps {
  history: TranslationEntry[];
  appLang: AppLanguage;
  darkMode: boolean;
}

const Learn: React.FC<LearnProps> = ({ history, appLang, darkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const t = (key: string) => DICTIONARY[key]?.[appLang] || key;

  if (history.length === 0) return (
    <div className="text-center py-20 opacity-50 font-bold">{t('noHistory')}</div>
  );

  const current = history[currentIndex];

  return (
    <div className="learn-container animate-fade-in">
      <div className="flashcard-wrapper">
        <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
          <div className="flashcard-face">
            <span className="card-label">{current.sourceLang}</span>
            <h3 className="text-4xl font-bold text-center">{current.sourceText}</h3>
            <PronunciationButton text={current.sourceText} className="mt-10" />
            <div className="absolute bottom-10 text-[10px] font-bold tracking-widest opacity-30">CLICK TO REVEAL</div>
          </div>
          <div className="flashcard-face face-back">
            <span className="card-label text-white/50">{current.targetLang}</span>
            <h3 className={`text-5xl font-bold text-center ${current.targetLang === 'Persian' ? 'rtl' : ''}`}>
              {current.translatedText}
            </h3>
            <PronunciationButton text={current.translatedText} className="mt-10 text-white/80" />
            {current.definition && (
              <p className="mt-6 text-sm text-center italic opacity-70 max-w-[250px]">{current.definition}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-12 mt-12">
        <button 
          onClick={() => { setFlipped(false); setCurrentIndex((prev) => (prev > 0 ? prev - 1 : history.length - 1)); }}
          className="p-4 rounded-full bg-surface card-shadow hover:scale-110 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-sm font-black tracking-widest text-muted">
          {currentIndex + 1} / {history.length}
        </div>
        <button 
          onClick={() => { setFlipped(false); setCurrentIndex((prev) => (prev + 1) % history.length); }}
          className="p-4 rounded-full bg-surface card-shadow hover:scale-110 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Learn;
