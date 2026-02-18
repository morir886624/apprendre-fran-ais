
import React from 'react';
import { AppLanguage, DICTIONARY } from '../types';

interface HeaderProps {
  appLang: AppLanguage;
  setAppLang: (lang: AppLanguage) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  appLang, 
  setAppLang, 
  darkMode, 
  setDarkMode, 
  activeTab, 
  setActiveTab 
}) => {
  const t = (key: string) => DICTIONARY[key]?.[appLang] || key;

  return (
    <header className={`${darkMode ? 'bg-slate-950 border-white/10' : 'bg-white border-black/10'} border-b sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('translate')}>
          <div className="w-10 h-10 bg-indigo-900 dark:bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">P</div>
          <h1 className="text-xl font-black tracking-tighter">PersianPro</h1>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {['translate', 'learn', 'quiz', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-black tracking-widest uppercase transition-all ${
                activeTab === tab 
                  ? 'opacity-100 border-b-2 border-indigo-500 pb-1' 
                  : 'opacity-40 hover:opacity-100'
              }`}
            >
              {t(tab)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setAppLang(appLang === 'fr' ? 'fa' : 'fr')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black border-2 ${
              darkMode ? 'border-white/20 bg-white/5' : 'border-black/10 bg-black/5'
            }`}
          >
            {appLang === 'fr' ? 'FA' : 'FR'}
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2.5 rounded-full transition-all border ${
              darkMode ? 'border-white/20 bg-white/5 text-yellow-400' : 'border-black/10 bg-black/5 text-slate-800'
            }`}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;