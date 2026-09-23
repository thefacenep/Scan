import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function QRPrint() {
  const { lang } = useLanguage();
  const t = translations[lang];
  // QR code points to the feedback form URL
  // IMPORTANT: Ensure your deployment (Vercel/Netlify) has "Deployment Protection" DISABLED
  // so the public can access without login. Check: Vercel Project Settings → Deployment Protection → Disabled
  const feedbackUrl = window.location.origin + '/feedback';

  return (
    <div className="min-h-screen bg-white print:min-h-0 print:bg-white">
      {/* Screen-only header */}
      <div className="print:hidden bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">QR Code Print Preview</p>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors"
            >
              🖨️ Print
            </button>
          </div>
          {/* Vercel Deployment Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
            <p className="font-semibold mb-1">⚠️ Important: Vercel Deployment Protection</p>
            <p>If scanning the QR code asks for login, go to your <strong>Vercel Dashboard → Project Settings → Deployment Protection</strong> and set it to <strong>"Disabled"</strong> or <strong>"Public"</strong>. The QR code below links to: <code className="bg-yellow-100 px-1 rounded">{feedbackUrl}</code></p>
          </div>
        </div>
      </div>

      {/* Print Content */}
      <div className="max-w-2xl mx-auto px-6 py-10 print:py-0 print:px-4 print:max-w-none flex flex-col items-center justify-center min-h-screen print:min-h-0">
        {/* Office Emblem */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-xl mb-6 print:w-20 print:h-20 print:mb-4 border-2 border-gray-200 overflow-hidden">
          <img 
            src="/emblem.svg" 
            alt="नेपालको सरकार - Emblem of Nepal Government" 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-blue-800 text-2xl font-bold">नेरा</span>';
            }}
          />
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
            value={feedbackUrl}
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
            {feedbackUrl}
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
