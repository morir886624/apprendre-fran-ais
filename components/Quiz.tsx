
import React, { useState } from 'react';
import { generateQuizQuestions } from '../services/gemini';
import { AppLanguage, DICTIONARY, QuizQuestion, TranslationEntry } from '../types';
import PronunciationButton from './PronunciationButton';
import './Quiz.css';

interface QuizProps {
  history: TranslationEntry[];
  appLang: AppLanguage;
  darkMode: boolean;
}

const Quiz: React.FC<QuizProps> = ({ history, appLang, darkMode }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [state, setState] = useState<'idle' | 'active' | 'finished'>('idle');

  const t = (key: string) => DICTIONARY[key]?.[appLang] || key;

  const start = async () => {
    if (history.length < 2) return;
    const q = await generateQuizQuestions(history);
    setQuestions(q.slice(0, 10));
    setCurrentIndex(0);
    setScore(0);
    setState('active');
  };

  const answer = (opt: string) => {
    if (isAnswered) return;
    setSelected(opt);
    setIsAnswered(true);
    if (opt === questions[currentIndex].correctAnswer) setScore(score + 1);
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      setState('finished');
    }
  };

  if (state === 'idle') return (
    <div className="max-w-md mx-auto py-20 text-center animate-fade-in">
      <div className="quiz-card">
        <h2 className="text-3xl font-black mb-4">{t('quiz')}</h2>
        <p className="text-muted mb-8">Test your knowledge with your saved words.</p>
        <button onClick={start} className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-light">
          {t('startQuiz')}
        </button>
      </div>
    </div>
  );

  if (state === 'finished') return (
    <div className="max-w-md mx-auto py-20 text-center animate-fade-in">
      <div className="quiz-card">
        <div className="text-6xl mb-6">🏆</div>
        <h2 className="text-2xl font-black mb-2">Quiz Finished!</h2>
        <p className="text-5xl font-black text-primary mb-10">{score} / {questions.length}</p>
        <button onClick={() => setState('idle')} className="w-full py-4 border-2 border-primary text-primary rounded-2xl font-bold hover:bg-primary-subtle">
          Try Again
        </button>
      </div>
    </div>
  );

  const q = questions[currentIndex];

  return (
    <div className="container-wide py-10 animate-fade-in">
      <div className="quiz-card">
        <div className="flex justify-between items-center mb-8">
          <span className="text-[10px] font-black tracking-widest text-muted uppercase">Question {currentIndex+1} of {questions.length}</span>
          <PronunciationButton text={q.word} size="sm" />
        </div>
        
        <h3 className={`text-4xl font-bold text-center mb-10 ${currentIndex % 2 === 0 ? 'rtl' : ''}`}>{q.word}</h3>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const correct = opt === q.correctAnswer;
            const chosen = opt === selected;
            let status = '';
            if (isAnswered) {
              if (correct) status = 'correct';
              else if (chosen) status = 'incorrect';
            }
            return (
              <button key={i} onClick={() => answer(opt)} disabled={isAnswered} className={`quiz-option ${status}`}>
                {opt}
                {isAnswered && correct && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <button onClick={next} className="w-full mt-10 py-4 bg-primary text-white rounded-2xl font-bold">
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
