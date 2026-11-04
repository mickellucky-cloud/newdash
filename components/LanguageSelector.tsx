'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, SupportedLanguage } from '@/lib/store/useAppStore';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  ];

  const current = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1B1B20] hover:bg-[#26262D] border border-[#26262D] text-xs font-medium text-neutral-300 transition-colors"
      >
        <span className="text-sm">{current.flag}</span>
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 bg-[#131316] border border-[#26262D] rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-[#26262D]">
            Select Language
          </div>
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLanguage(l.code);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-xs flex items-center justify-between text-left transition-colors ${
                language === l.code
                  ? 'bg-[#7A12F5]/20 text-[#C9A6FF] font-medium'
                  : 'text-neutral-300 hover:bg-[#1B1B20] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </div>
              {language === l.code && <span className="text-[#C9A6FF] font-bold">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
