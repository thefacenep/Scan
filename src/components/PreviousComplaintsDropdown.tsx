import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface PreviousComplaint {
  code: string;
  service: string;
  status: string;
  date: string;
}

export default function PreviousComplaintsDropdown() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [complaints, setComplaints] = useState<PreviousComplaint[]>([]);

  useEffect(() => {
    // Load complaints from localStorage
    const loadComplaints = () => {
      const stored = localStorage.getItem('my_complaints');
      if (stored) {
        try {
          setComplaints(JSON.parse(stored));
        } catch (e) {
          console.error('Error loading previous complaints:', e);
        }
      }
    };

    loadComplaints();

    // Listen for storage changes
    window.addEventListener('storage', loadComplaints);
    
    // Also check for changes when window gains focus
    const handleFocus = () => loadComplaints();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', loadComplaints);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleTrack = (code: string) => {
    navigate(`/track?code=${code}`);
    setIsOpen(false);
  };

  if (complaints.length === 0) {
    return null; // Don't show button if no complaints
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ width: '60px', height: '60px' }}
        aria-label={lang === 'np' ? 'अघिल्ला उजुरीहरू' : 'Previous Complaints'}
      >
        <div className="flex items-center justify-center h-full">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        {/* Badge */}
        <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
          {complaints.length}
        </span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4">
              <h3 className="font-bold text-base">
                {lang === 'np' ? 'तपाईंका अघिल्ला उजुरीहरू' : 'Your Previous Complaints'}
              </h3>
              <p className="text-xs opacity-90 mt-1">
                {complaints.length} {lang === 'np' ? 'उजुरी' : 'complaint'}{complaints.length !== 1 ? (lang === 'np' ? 'हरू' : 's') : ''}
              </p>
            </div>

            {/* Complaints List */}
            <div className="max-h-96 overflow-y-auto">
              {complaints.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">
                    {lang === 'np' 
                      ? 'यस उपकरणमा कुनै अघिल्लो उजुरी भेटिएन।' 
                      : 'No previous complaints found on this device.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {complaints.map((complaint, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">📋</span>
                            <p className="text-sm font-mono font-bold text-red-700 truncate">
                              {complaint.code}
                            </p>
                          </div>
                          <p className="text-xs text-gray-600 mb-1 truncate">
                            {complaint.service}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              complaint.status === 'Responded'
                                ? 'bg-green-100 text-green-800'
                                : complaint.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {complaint.status === 'Responded' && '✓ '}
                              {complaint.status === 'Pending' && '⏳ '}
                              {complaint.status}
                            </span>
                            <span className="text-xs text-gray-400">
                              {complaint.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTrack(complaint.code)}
                        className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        {lang === 'np' ? 'ट्र्याक गर्नुहोस्' : 'Track'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-3 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                {lang === 'np' ? 'बन्द गर्नुहोस्' : 'Close'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
