
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Translator from './components/Translator';
import History from './components/History';
import Learn from './components/Learn';
import Quiz from './components/Quiz';
import { AppLanguage, TranslationEntry } from './types';

const App: React.FC = () => {
  const [appLang, setAppLang] = useState<AppLanguage>('fr');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('translate');
  const [history, setHistory] = useState<TranslationEntry[]>([]);

  // Load state from local storage (mimicking a spreadsheet database)
  useEffect(() => {
    const savedHistory = localStorage.getItem('persianpro_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedDark = localStorage.getItem('persianpro_dark');
    if (savedDark) setDarkMode(savedDark === 'true');

    const savedLang = localStorage.getItem('persianpro_lang');
    if (savedLang) setAppLang(savedLang as AppLanguage);
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('persianpro_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('persianpro_dark', darkMode.toString());
    if (darkMode) {
      document.body.classList.add('bg-slate-900');
      document.body.classList.remove('bg-gray-50');
    } else {
      document.body.classList.add('bg-gray-50');
      document.body.classList.remove('bg-slate-900');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('persianpro_lang', appLang);
  }, [appLang]);

  const handleSaveTranslation = (entry: Omit<TranslationEntry, 'id' | 'timestamp'>) => {
    const newEntry: TranslationEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  const clearHistory = () => {
    if (window.confirm('Voulez-vous vraiment effacer tout votre historique ?')) {
      setHistory([]);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'translate':
        return <Translator appLang={appLang} darkMode={darkMode} onSave={handleSaveTranslation} />;
      case 'history':
        return <History history={history} appLang={appLang} darkMode={darkMode} onClear={clearHistory} />;
      case 'learn':
        return <Learn history={history} appLang={appLang} darkMode={darkMode} />;
      case 'quiz':
        return <Quiz history={history} appLang={appLang} darkMode={darkMode} />;
      default:
        return <Translator appLang={appLang} darkMode={darkMode} onSave={handleSaveTranslation} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Header 
        appLang={appLang} 
        setAppLang={setAppLang} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <main className="pb-20">
        <div className="max-w-6xl mx-auto py-6">
          {renderTab()}
        </div>
      </main>

      {/* Mobile Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t flex justify-around p-3 z-50 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        {['translate', 'learn', 'quiz', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`p-2 rounded-xl transition-all ${
              activeTab === tab 
                ? 'bg-indigo-600 text-white' 
                : (darkMode ? 'text-slate-400' : 'text-slate-400')
            }`}
          >
             {tab === 'translate' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>}
             {tab === 'learn' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
             {tab === 'quiz' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
             {tab === 'history' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
