import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANG_STORAGE_KEY = 'resume-lang';

export default function LanguageSwitcher({ className = '' }) {
  const { i18n, t } = useTranslation();

  const setLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem(LANG_STORAGE_KEY, lng);
  };

  return (
    <div className={`inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white/80 p-1 ${className}`}>
      <Globe size={16} className="text-slate-500 shrink-0" />
      <button
        type="button"
        onClick={() => setLang('zh')}
        className={`px-2 py-1 text-sm rounded-md transition-colors ${
          i18n.language === 'zh' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        {t('lang.zh')}
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 py-1 text-sm rounded-md transition-colors ${
          i18n.language === 'en' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        {t('lang.en')}
      </button>
    </div>
  );
}
