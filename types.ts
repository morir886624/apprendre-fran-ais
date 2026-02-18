
export type AppLanguage = 'fr' | 'fa';

export interface TranslationEntry {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  definition?: string;
  timestamp: number;
}

export interface QuizQuestion {
  id: string;
  word: string;
  correctAnswer: string;
  options: string[];
  type: 'translation' | 'reverse-translation';
}

export interface AppDictionary {
  [key: string]: {
    fr: string;
    fa: string;
  };
}

export const DICTIONARY: AppDictionary = {
  translate: { fr: 'Traduire', fa: 'ترجمه' },
  learn: { fr: 'Apprendre', fa: 'یادگیری' },
  quiz: { fr: 'Quiz', fa: 'آزمون' },
  history: { fr: 'Historique', fa: 'تاریخچه' },
  settings: { fr: 'Paramètres', fa: 'تنظیمات' },
  sourcePlaceholder: { fr: 'Entrez du texte...', fa: 'متن را وارد کنید...' },
  translationPlaceholder: { fr: 'Traduction...', fa: 'ترجمه...' },
  save: { fr: 'Enregistrer', fa: 'ذخیره' },
  saved: { fr: 'Enregistré', fa: 'ذخیره شد' },
  noHistory: { fr: 'Aucune traduction enregistrée.', fa: 'هیچ ترجمه‌ای ذخیره نشده است.' },
  startQuiz: { fr: 'Commencer le Quiz', fa: 'شروع آزمون' },
  back: { fr: 'Retour', fa: 'بازگشت' },
  theme: { fr: 'Thème', fa: 'تم' },
  language: { fr: 'Langue', fa: 'زبان' },
  export: { fr: 'Exporter (CSV)', fa: 'خروجی (CSV)' },
  definition: { fr: 'Définition', fa: 'تعریف' }
};
