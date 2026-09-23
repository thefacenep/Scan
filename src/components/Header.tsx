import React from 'react';

interface HeaderProps {
  /** Show the language toggle button */
  showLangToggle?: boolean;
  /** Current language */
  lang?: 'np' | 'en';
  /** Language toggle handler */
  onLangToggle?: () => void;
  /** Optional subtitle line below the main header */
  subtitle?: string;
  /** Compact variant for pages with limited space */
  compact?: boolean;
}

export default function Header({
  showLangToggle = false,
  lang = 'np',
  onLangToggle,
  subtitle,
  compact = false,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b-2 border-[#DC143C]">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          {/* Centered Text Hierarchy */}
          <div className="flex-1 text-center">
            {/* Line 1: Government of Nepal (smallest) */}
            <p className="text-xs text-[#DC143C] leading-tight mb-1">
              नेपाल सरकार
            </p>

            {/* Line 2: Ministry of Finance */}
            <p className="text-xs text-[#DC143C] leading-tight mb-1">
              अर्थ मन्त्रालय
            </p>

            {/* Line 3: Inland Revenue Department */}
            <p className={`${compact ? 'text-sm' : 'text-sm sm:text-base'} text-[#DC143C] leading-tight font-semibold mb-2`}>
              आन्तरिक राजस्व विभाग
            </p>

            {/* Line 4: Office Name (LARGEST & BOLDEST - Most Prominent) */}
            <p className={`${compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} text-[#DC143C] leading-tight font-black tracking-tight`}>
              आन्तरिक राजस्व कार्यालय, कोटेश्वर
            </p>
          </div>

          {/* Language Toggle (optional) */}
          {showLangToggle && onLangToggle && (
            <button
              onClick={onLangToggle}
              className="flex-shrink-0 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-red-50 to-red-100 text-[#DC143C] rounded-full border-2 border-[#DC143C] hover:from-red-100 hover:to-red-200 transition-all shadow-sm"
              aria-label="Toggle language"
            >
              {lang === 'np' ? 'EN' : 'NP'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
