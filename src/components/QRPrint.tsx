import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function QRPrint() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const siteUrl = window.location.origin;

  return (
    <div className="min-h-screen bg-white print:min-h-0 print:bg-white">
      {/* Screen-only header */}
      <div className="print:hidden bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <p className="text-sm text-gray-600">QR Code Print Preview</p>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Print Content */}
      <div className="max-w-2xl mx-auto px-6 py-10 print:py-0 print:px-4 print:max-w-none flex flex-col items-center justify-center min-h-screen print:min-h-0">
        {/* Office Emblem */}
        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-xl mb-6 print:w-16 print:h-16 print:mb-4">
          <span className="text-white text-2xl font-bold print:text-xl">नेरा</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 mb-2 print:text-2xl">
          {t.officeTitle}
        </h1>
        <p className="text-base sm:text-lg text-center text-gray-600 mb-6 print:text-sm print:mb-4">
          Inland Revenue Office, Koteshwor
        </p>

        {/* Divider */}
        <div className="w-32 h-1 bg-red-600 rounded-full mb-6 print:mb-4"></div>

        {/* Subheading */}
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-700 mb-2 print:text-lg">
          {t.scanTitle}
        </h2>
        <p className="text-base text-center text-gray-500 mb-8 print:text-sm print:mb-6">
          {t.scanTitleEn}
        </p>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-2xl shadow-2xl border-4 border-red-100 mb-8 print:shadow-none print:border-2 print:border-gray-300 print:p-4 print:rounded-xl">
          <QRCodeSVG
            value={siteUrl}
            size={280}
            level="H"
            includeMargin={true}
            className="print:w-[250px] print:h-[250px]"
            fgColor="#1a1a1a"
            bgColor="#ffffff"
          />
        </div>

        {/* Instructions */}
        <div className="text-center space-y-2 mb-8 print:mb-4">
          <p className="text-sm text-gray-600">
            📱 {t.qrInstructions}
          </p>
          <p className="text-sm text-gray-500">
            {t.qrInstructionsEn}
          </p>
          <p className="text-xs text-gray-400 mt-3 font-mono bg-gray-50 px-4 py-2 rounded-lg inline-block print:bg-transparent">
            {siteUrl}
          </p>
        </div>

        {/* Footer Info */}
        <div className="text-center border-t border-gray-200 pt-4 w-full print:pt-3">
          <p className="text-xs text-gray-500">{t.location}</p>
          <p className="text-xs text-gray-500 mt-1">
            📞 {t.phone}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ✉️ {t.emailAddr}
          </p>
        </div>
      </div>
    </div>
  );
}
