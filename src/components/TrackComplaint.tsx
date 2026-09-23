import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { Complaint, getComplaintById } from '../utils/storage';

const ratingEmojis = ['😞', '😕', '😐', '😊', '😃'];

export default function TrackComplaint() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [code, setCode] = useState('');
  const [result, setResult] = useState<Complaint | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trackCode = searchParams.get('track');
    if (trackCode) {
      setCode(trackCode);
      handleSearch(trackCode);
    }
  }, [searchParams]);

  const handleSearch = async (searchCode?: string) => {
    const codeToSearch = searchCode || code;
    if (!codeToSearch.trim()) return;

    setIsLoading(true);
    setSearched(true);
    
    const found = await getComplaintById(codeToSearch);
    setResult(found);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b-2 border-[#DC143C]">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 text-center">
              <p className="text-xs text-[#DC143C] leading-tight mb-1">
                नेपाल सरकार
              </p>
              <p className="text-xs text-[#DC143C] leading-tight mb-1">
                अर्थ मन्त्रालय
              </p>
              <p className="text-sm sm:text-base text-[#DC143C] leading-tight font-semibold mb-2">
                आन्तरिक राजस्व विभाग
              </p>
              <p className="text-xl sm:text-2xl text-[#DC143C] leading-tight font-black tracking-tight">
                आन्तरिक राजस्व कार्यालय, कोटेश्वर
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 text-xs font-medium bg-gray-100 rounded-full border border-gray-200 hover:bg-gray-200"
            >
              ← {t.backToForm}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6">
        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">{t.searchByCode}</h2>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="IRO-KTW-YYYYMMDD-XXXX"
              className="flex-1 h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none text-sm font-mono"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="h-12 px-5 bg-red-700 text-white font-bold rounded-xl hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : (
                t.track
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        {searched && (
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
            {isLoading ? (
              <div className="text-center py-8">
                <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <p className="text-gray-500">{lang === 'np' ? 'खोजी हुँदैछ...' : 'Searching...'}</p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {/* Header with Status */}
                <div className="text-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    result.status === 'Responded' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <span className="text-2xl">{result.status === 'Responded' ? '✅' : '⏳'}</span>
                  </div>
                  <p className="font-mono font-bold text-red-700 text-sm break-all">{result.id}</p>
                  <p className="text-xs text-gray-500 mt-1">{result.date}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    result.status === 'Responded' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {result.status === 'Responded' 
                      ? (lang === 'np' ? '✅ जवाफ दिइएको' : '✅ Responded') 
                      : (lang === 'np' ? '⏳ बाँकी' : '⏳ Pending')}
                  </span>
                </div>

                {/* Service & Category */}
                <div className="flex gap-2 justify-center flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {result.service}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    result.category === 'Praise' ? 'bg-green-100 text-green-700' :
                    result.category === 'Suggestion' ? 'bg-blue-100 text-blue-700' :
                    result.category === 'Complaint' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {result.category}
                  </span>
                </div>

                {/* Ratings */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lang === 'np' ? 'सेवा मूल्याङ्कन' : 'Service Rating'}:</span>
                    <span className="text-lg">{ratingEmojis[result.serviceRating - 1] || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{lang === 'np' ? 'कर्मचारी मूल्याङ्कन' : 'Staff Rating'}:</span>
                    <span className="text-lg">{ratingEmojis[result.staffRating - 1] || '-'}</span>
                  </div>
                  {result.waitingTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{lang === 'np' ? 'प्रतीक्षा समय' : 'Waiting Time'}:</span>
                      <span className="text-xs font-medium text-gray-700">{result.waitingTime}</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                {result.details && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">
                      {lang === 'np' ? 'विवरण' : 'Details'}
                    </label>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 whitespace-pre-wrap">
                      {result.details}
                    </p>
                  </div>
                )}

                {/* Response */}
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">
                    {lang === 'np' ? 'कार्यालयको जवाफ' : 'Office Response'}
                  </label>
                  {result.response ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-sm text-green-700 whitespace-pre-wrap">{result.response}</p>
                      {result.responseDate && (
                        <p className="text-xs text-green-600 mt-2">
                          {lang === 'np' ? 'जवाफ मिति' : 'Responded on'}: {result.responseDate}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-sm text-yellow-700">
                        ⏳ {lang === 'np' 
                          ? 'तपाईंको उजुरी समीक्षा अधीनमा छ। हामी चाँडै जवाफ दिनेछौं।' 
                          : 'Your complaint is being reviewed. We will respond soon.'}
                      </p>
                    </div>
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
