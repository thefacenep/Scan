import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const categoryColors: Record<Category, string> = {
  praise: 'bg-green-100 text-green-700',
  suggestion: 'bg-blue-100 text-blue-700',
  complaint: 'bg-red-100 text-red-700',
  grievance: 'bg-orange-100 text-orange-700',
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

export default function Dashboard() {
  const { lang } = useLanguage();
  const { feedbacks, updateResponse } = useFeedback();
  const t = translations[lang];
  const navigate = useNavigate();

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showRespond, setShowRespond] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');

  const handleLogout = () => {
    localStorage.removeItem('iro-admin-auth');
    navigate('/admin');
  };

  const handleSaveResponse = () => {
    if (selectedFeedback && responseText.trim()) {
      updateResponse(selectedFeedback.id, responseText);
      setSelectedFeedback({ ...selectedFeedback, response: responseText });
      setShowRespond(false);
      setResponseText('');
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Code', 'Date', 'Service Type', 'Category', 'Name', 'PAN', 'Contact', 'Email',
      'Visit Date', 'Overall Service', 'Staff Behavior', 'Waiting Time',
      'Description', 'Response', 'Submitted At'
    ];

    const rows = feedbacks.map(f => [
      f.code,
      f.dateOfVisit,
      serviceLabels[f.serviceType]?.[lang] || f.serviceType,
      categoryLabels[f.category][lang],
      f.isAnonymous ? 'Anonymous' : f.name,
      f.pan,
      f.contact,
      f.email,
      f.dateOfVisit,
      f.overallService,
      f.staffBehavior,
      f.waitingTime,
      f.description.replace(/"/g, '""'),
      f.response.replace(/"/g, '""'),
      new Date(f.submittedAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IRO-Koteshwor-Feedbacks-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredFeedbacks = filterCategory === 'all'
    ? feedbacks
    : feedbacks.filter(f => f.category === filterCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">नेरा</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800">{t.dashboard}</h1>
              <p className="text-[10px] text-gray-500">{t.officeTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              📥 {t.export}
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className="text-xl font-bold text-gray-800">{feedbacks.length}</p>
            <p className="text-[10px] text-gray-500">Total</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
            <p className="text-xl font-bold text-green-700">{feedbacks.filter(f => f.category === 'praise').length}</p>
            <p className="text-[10px] text-green-600">{t.praise}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
            <p className="text-xl font-bold text-red-700">{feedbacks.filter(f => f.category === 'complaint').length}</p>
            <p className="text-[10px] text-red-600">{t.complaint}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
            <p className="text-xl font-bold text-purple-700">{feedbacks.filter(f => f.response).length}</p>
            <p className="text-[10px] text-purple-600">Responded</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterCategory === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            All ({feedbacks.length})
          </button>
          {(Object.keys(categoryLabels) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {categoryLabels[cat][lang]} ({feedbacks.filter(f => f.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <span className="text-4xl block mb-3">📭</span>
            <p>{t.noFeedbacks}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${categoryColors[feedback.category]}`}>
                        {categoryLabels[feedback.category][lang]}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                        {serviceLabels[feedback.serviceType]?.[lang] || feedback.serviceType}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{feedback.code}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      {feedback.isAnonymous ? t.anonymousLabel : feedback.name || t.anonymousLabel}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(feedback.submittedAt).toLocaleDateString(lang === 'np' ? 'ne-NP' : 'en-US')}
                    </p>
                    {feedback.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {feedback.description}
                      </p>
                    )}
                    {feedback.response && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <span>✅</span> Response given
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => setSelectedFeedback(feedback)}
                      className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      👁 {t.viewDetails}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFeedback(feedback);
                        setResponseText(feedback.response);
                        setShowRespond(true);
                      }}
                      className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      💬 {t.respond}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedFeedback && !showRespond && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-bold text-gray-800">{t.viewDetails}</h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Code & Date */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-red-700">{selectedFeedback.code}</span>
                <span className="text-xs text-gray-500">
                  {new Date(selectedFeedback.submittedAt).toLocaleDateString()}
                </span>
              </div>

              {/* Category & Service */}
              <div className="flex gap-2 flex-wrap">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColors[selectedFeedback.category]}`}>
                  {categoryLabels[selectedFeedback.category][lang]}
                </span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {serviceLabels[selectedFeedback.serviceType]?.[lang] || selectedFeedback.serviceType}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t.name}:</span>
                  <span className="font-medium">{selectedFeedback.isAnonymous ? t.anonymousLabel : selectedFeedback.name || '-'}</span>
                </div>
                {selectedFeedback.pan && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.pan}:</span>
                    <span className="font-medium">{selectedFeedback.pan}</span>
                  </div>
                )}
                {selectedFeedback.contact && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.contact}:</span>
                    <span className="font-medium">{selectedFeedback.contact}</span>
                  </div>
                )}
                {selectedFeedback.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.email}:</span>
                    <span className="font-medium text-xs">{selectedFeedback.email}</span>
                  </div>
                )}
                {selectedFeedback.dateOfVisit && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.dateOfVisit}:</span>
                    <span className="font-medium">{selectedFeedback.dateOfVisit}</span>
                  </div>
                )}
              </div>

              {/* Ratings */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{t.overallRating}</span>
                  <span className="text-lg">{ratingEmojis[selectedFeedback.overallService - 1] || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{t.staffRating}</span>
                  <span className="text-lg">{ratingEmojis[selectedFeedback.staffBehavior - 1] || '-'}</span>
                </div>
                {selectedFeedback.waitingTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{t.waitingTimeLabel}</span>
                    <span className="text-xs font-medium text-gray-700">
                      {(t.waitingOptions as Record<string, string>)[selectedFeedback.waitingTime]}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedFeedback.description && (
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">{t.descriptionLabel}</label>
                  <p className="text-sm text-gray-800 bg-gray-50 rounded-xl p-3 whitespace-pre-wrap">
                    {selectedFeedback.description}
                  </p>
                </div>
              )}

              {/* Response */}
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">{t.responseLabel}</label>
                {selectedFeedback.response ? (
                  <p className="text-sm text-green-700 bg-green-50 rounded-xl p-3 whitespace-pre-wrap">
                    {selectedFeedback.response}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">{t.noResponse}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="flex-1 h-11 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  {t.close}
                </button>
                <button
                  onClick={() => {
                    setResponseText(selectedFeedback.response);
                    setShowRespond(true);
                  }}
                  className="flex-1 h-11 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
                >
                  💬 {t.respond}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Respond Modal */}
      {showRespond && selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">{t.respond} - {selectedFeedback.code}</h3>
              <button
                onClick={() => { setShowRespond(false); setSelectedFeedback(null); }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">{t.descriptionLabel}:</p>
                <p className="text-sm text-gray-700 line-clamp-3">{selectedFeedback.description || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">{t.responseLabel}</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder={t.responsePlaceholder}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none text-sm resize-none"
                  style={{ minHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSaveResponse}
                disabled={!responseText.trim()}
                className="w-full h-12 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.sendResponse}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
