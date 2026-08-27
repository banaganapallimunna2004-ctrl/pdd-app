import React, { useState, useRef, useEffect } from 'react';
import { useTranslation, availableLanguages } from '../i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LanguageSelector = ({ compact = false }) => {
  const { lang, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const currentLang = availableLanguages.find((l) => l.code === lang) || availableLanguages[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative z-50 inline-block text-left select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-2xl border border-emerald-900/15 bg-white/95 px-3.5 py-2 text-xs font-black text-slate-900 shadow-sm backdrop-blur-xl transition-all duration-200 hover:border-emerald-600 hover:bg-emerald-50 hover:shadow-md cursor-pointer"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4 text-emerald-700 shrink-0" />
        <span className="text-base leading-none">{currentLang.flag}</span>
        {!compact && (
          <span className="hidden sm:inline font-black text-slate-800 text-xs">
            {currentLang.nativeName}
          </span>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 origin-top-right z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="rounded-3xl border border-emerald-900/10 bg-white p-2 shadow-2xl shadow-emerald-950/20 backdrop-blur-2xl ring-1 ring-black/5">
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
                  Select Language / भाषा
                </p>
                <Globe size={12} className="text-emerald-700" />
              </div>
              <div className="mt-1 space-y-0.5 max-h-72 overflow-y-auto no-scrollbar">
                {availableLanguages.map((language) => (
                  <button
                    key={language.code}
                    type="button"
                    onClick={() => {
                      changeLanguage(language.code);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-150 cursor-pointer ${
                      lang === language.code
                        ? 'bg-emerald-100/80 text-emerald-950 font-black border border-emerald-300/60 shadow-sm'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold'
                    }`}
                  >
                    <span className="text-xl leading-none">{language.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black truncate leading-tight">{language.nativeName}</p>
                      <p className="text-[10px] text-slate-500 leading-tight">{language.label}</p>
                    </div>
                    {lang === language.code && (
                      <Check className="h-4 w-4 text-emerald-700 flex-shrink-0 stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;

