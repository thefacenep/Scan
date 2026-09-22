import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFeedback } from '../context/FeedbackContext';
import { translations } from '../translations';
import { Feedback, Category, ServiceType } from '../types';

const ratingEmojis = ['😞', '😕', '😐', '😊', '😃'];

const categoryLabels: Record<Category, { np: string; en: string }> = {
  praise: { np: 'प्रशंसा', en: 'Praise' },
  suggestion: { np: 'सुझाव', en: 'Suggestion' },
  complaint: { np: 'उजुरी', en: 'Complaint' },
  grievance: { np: 'गुनासो', en: 'Grievance' },
};

const serviceLabels: Record<ServiceType, { np: string; en: string }> = {
  help_desk: { np: 'करदाता सहायता कक्ष', en: 'Help Desk' },
  tax_clearance: { np: 'करचुक्ता लिने', en: 'Tax Clearance' },
  pdcr: { np: 'विवरण सच्याउने', en: 'PDCR' },
  file_transfer: { np: 'अफिस ट्रान्सफर', en: 'File Transfer' },
  personal_pan: { np: 'व्यक्तिगत प्यान बनाउने', en: 'Personal PAN' },
  business_pan: { np: 'व्यवसायिक प्यान बनाउने', en: 'Business PAN' },
  business_close: { np: 'व्यवसाय बन्द गर्ने', en: 'Business Close' },
  business_deregistration: { np: 'व्यवसाय पूर्ण खारेज गर्ने', en: 'Business Deregistration & PAN Down gradation' },
  scheme_apply: { np: 'स्किमको सूविधा लिने', en: 'Scheme Apply' },
  vat_adjustment: { np: 'कर समायोजन पत्र बनाउने', en: 'VAT Adjustment Letter' },
  due_clearance: { np: 'बक्यौता खारेजी', en: 'Due Clearance' },
  bank_reactivation: { np: 'बैंक खाता फुकुवा', en: 'Reactivation of closed bank account' },
  tax_audit: { np: 'कर परीक्षण', en: 'Tax Audit' },
  investigation: { np: 'अनुसन्धान', en: 'Investigation' },
  complaint: { np: 'उजुरी', en: 'Complaint' },
  others: { np: 'अन्य सेवा', en: 'Other' },
};

export default function TrackingPage() {
  const { lang } = useLanguage();
  const { findByCode } = useFeedback();
  const t = translations[lang];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [code, setCode] = useState('');
  const [result, setResult] = useState<Feedback | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const trackCode = searchParams.get('track');
    if (trackCode) {
      setCode(trackCode);
      const found = findByCode(trackCode);
      if (found) {
        setResult(found);
      }
      setSearched(true);
    }
  }, [searchParams, findByCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = findByCode(code);
    setResult(found || null);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 pb-8">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">नेरा</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800">{t.officeTitle}</h1>
              <p className="text-[10px] text-gray-500">{t.trackingResult}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1.5 text-xs font-medium bg-gray-100 rounded-full border border-gray-200 hover:bg-gray-200"
          >
            ← {t.backToForm}
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6">
        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">{t.searchByCode}</h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="IRO-KTW-XXXX"
              className="flex-1 h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none text-base font-mono"
            />
            <button
              type="submit"
              className="h-12 px-5 bg-red-700 text-white font-bold rounded-xl hover:bg-red-800 transition-colors"
            >
              {t.track}
            </button>
          </form>
        </div>

        {/* Result */}
        {searched && (
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
            {result ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">✅</span>
                  </div>
                  <p className="font-mono font-bold text-red-700 text-lg">{result.code}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(result.submittedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2 justify-center flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {serviceLabels[result.serviceType]?.[lang] || result.serviceType}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {categoryLabels[result.category][lang]}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  {result.dateOfVisit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t.dateOfVisit}:</span>
                      <span className="font-medium">{result.dateOfVisit}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t.overallRating}:</span>
                    <span className="text-lg">{ratingEmojis[result.overallService - 1] || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t.staffRating}:</span>
                    <span className="text-lg">{ratingEmojis[result.staffBehavior - 1] || '-'}</span>
                  </div>
                  {result.waitingTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t.waitingTimeLabel}:</span>
                      <span className="text-xs font-medium text-gray-700">
                        {(t.waitingOptions as Record<string, string>)[result.waitingTime]}
                      </span>
                    </div>
                  )}
                </div>

                {result.description && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">{t.descriptionLabel}</label>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 whitespace-pre-wrap">
                      {result.description}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">{t.responseLabel}</label>
                  {result.response ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="text-sm text-green-700 whitespace-pre-wrap">{result.response}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic bg-gray-50 rounded-xl p-3">{t.noResponse}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <span className="text-4xl block mb-3">❌</span>
                <p className="text-gray-500">{t.notFound}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
