
import React from 'react';
import { AppLanguage, DICTIONARY, TranslationEntry } from '../types';
import PronunciationButton from './PronunciationButton';
import './History.css';

interface HistoryProps {
  history: TranslationEntry[];
  appLang: AppLanguage;
  darkMode: boolean;
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ history, appLang, darkMode, onClear }) => {
  const t = (key: string) => DICTIONARY[key]?.[appLang] || key;

  const exportCSV = () => {
    const headers = ['Original', 'Translation', 'Note', 'Source', 'Target', 'Timestamp'];
    const rows = history.map(e => [
      `"${e.sourceText.replace(/"/g, '""')}"`,
      `"${e.translatedText.replace(/"/g, '""')}"`,
      `"${(e.definition || '').replace(/"/g, '""')}"`,
      e.sourceLang,
      e.targetLang,
      new Date(e.timestamp).toISOString()
    ]);

    const csv = "\ufeff" + [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translations_${Date.now()}.csv`;
    a.click();
  };

  if (history.length === 0) return (
    <div className="text-center py-24 animate-fade-in">
      <div className="text-7xl mb-6">📂</div>
      <p className="font-black text-xl tracking-tight uppercase opacity-20">{t('noHistory')}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 animate-fade-in">
      <div className="flex justify-between items-end mb-10 px-2">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">{t('history')}</h2>
          <p className="font-bold opacity-40 uppercase text-[10px] tracking-widest mt-1">{history.length} items total</p>
        </div>
        <div className="flex gap-4">
          <button onClick={exportCSV} className="text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl border-2 border-current hover:bg-current hover:invert transition-all">
            {t('export')}
          </button>
          <button onClick={onClear} className="text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all">
            Clear
          </button>
        </div>
      </div>

      <table className="history-table">
        <tbody>
          {history.map(entry => (
            <tr key={entry.id} className="history-row">
              <td className="history-cell">
                <div className="flex items-center gap-6">
                  <PronunciationButton text={entry.translatedText} size="md" />
                  <div>
                    <div className="history-word">{entry.sourceText}</div>
                    <div className={`history-translation text-indigo-600 dark:text-indigo-400 ${entry.targetLang === 'Persian' ? 'rtl' : ''}`}>
                      {entry.translatedText}
                    </div>
                  </div>
                </div>
              </td>
              <td className="history-cell text-sm font-medium italic max-w-xs truncate opacity-70">
                {entry.definition || '--'}
              </td>
              <td className="history-cell text-right history-timestamp">
                {new Date(entry.timestamp).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;