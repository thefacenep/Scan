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
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b-2 border-red-700">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Text Hierarchy - Main Content */}
          <div className="flex-1 text-center sm:text-left">
            {/* Line 1: Government of Nepal (smallest) */}
            <p className="text-[10px] sm:text-xs text-red-700 leading-tight">
              नेपाल सरकार / Government of Nepal
            </p>

            {/* Line 2: Ministry of Finance */}
            <p className="text-[11px] sm:text-xs text-red-700 leading-tight">
              अर्थ मन्त्रालय / Ministry of Finance
            </p>

            {/* Line 3: Inland Revenue Department */}
            <p className={`${compact ? 'text-xs' : 'text-xs sm:text-sm'} text-red-700 leading-tight font-medium`}>
              आन्तरिक राजस्व विभाग / Inland Revenue Department
            </p>

            {/* Line 4: Office Name (largest & boldest) */}
            <p className={`${compact ? 'text-sm' : 'text-sm sm:text-base'} text-red-700 leading-tight font-extrabold`}>
              आन्तरिक राजस्व कार्यालय, कोटेश्वर
            </p>
            <p className="text-[10px] sm:text-xs text-red-700 leading-tight font-semibold italic">
              Inland Revenue Office, Koteshwor
            </p>

            {/* Optional subtitle */}
            {subtitle && (
              <p className="text-[10px] sm:text-xs text-red-700/80 mt-1 italic">
                {subtitle}
              </p>
            )}
          </div>

          {/* Language Toggle (optional) */}
          {showLangToggle && onLangToggle && (
            <button
              onClick={onLangToggle}
              className="flex-shrink-0 px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-full border border-red-300 hover:from-red-100 hover:to-red-200 transition-all shadow-sm"
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
