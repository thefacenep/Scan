import React, { useState } from 'react';
import { Complaint } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

interface ComplaintModalProps {
  complaint: Complaint;
  onClose: () => void;
  onRespond: (id: string, response: string) => void;
}

const ratingEmojis = ['😞', '😕', '😐', '😊', '😃'];

export default function ComplaintModal({ complaint, onClose, onRespond }: ComplaintModalProps) {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [responseText, setResponseText] = useState(complaint.response || '');
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendResponse = () => {
    if (responseText.trim()) {
      onRespond(complaint.id, responseText);
      setSuccessMessage(lang === 'np' ? 'जवाफ सफलतापूर्वक पठाइयो!' : 'Response sent successfully!');
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{t.viewDetails}</h3>
            <p className="text-xs text-gray-500 font-mono">{complaint.id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <span>✅</span> {successMessage}
            </div>
          )}

          {/* Status & Date */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              complaint.status === 'Responded' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {complaint.status === 'Responded' ? '✅ Responded' : '⏳ Pending'}
            </span>
            <span className="text-xs text-gray-500">{complaint.date}</span>
          </div>

          {/* Service & Category */}
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {complaint.service}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              complaint.category === 'Praise' ? 'bg-green-100 text-green-700' :
              complaint.category === 'Suggestion' ? 'bg-blue-100 text-blue-700' :
              complaint.category === 'Complaint' ? 'bg-red-100 text-red-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {complaint.category}
            </span>
          </div>

          {/* Personal Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Personal Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500 text-xs">Name:</span>
                <p className="font-medium">{complaint.name}</p>
              </div>
              {complaint.pan && (
                <div>
                  <span className="text-gray-500 text-xs">PAN:</span>
                  <p className="font-medium">{complaint.pan}</p>
                </div>
              )}
              {complaint.contact && (
                <div>
                  <span className="text-gray-500 text-xs">Contact:</span>
                  <p className="font-medium">{complaint.contact}</p>
                </div>
              )}
              {complaint.email && (
                <div>
                  <span className="text-gray-500 text-xs">Email:</span>
                  <p className="font-medium text-xs">{complaint.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ratings */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Ratings</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Service Rating:</span>
                <div className="flex items-center gap-1">
                  <span className="text-2xl">{ratingEmojis[complaint.serviceRating - 1] || '-'}</span>
                  <span className="text-sm text-gray-500">({complaint.serviceRating}/5)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Staff Rating:</span>
                <div className="flex items-center gap-1">
                  <span className="text-2xl">{ratingEmojis[complaint.staffRating - 1] || '-'}</span>
                  <span className="text-sm text-gray-500">({complaint.staffRating}/5)</span>
                </div>
              </div>
              {complaint.waitingTime && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Waiting Time:</span>
                  <span className="text-xs font-medium text-gray-700">{complaint.waitingTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Complaint Details */}
          {complaint.details && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Complaint Details</h4>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{complaint.details}</p>
              </div>
            </div>
          )}

          {/* Response Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Response</h4>
            {complaint.response && !showResponseForm ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-700 whitespace-pre-wrap mb-2">{complaint.response}</p>
                {complaint.responseDate && (
                  <p className="text-xs text-green-600">Responded on: {complaint.responseDate}</p>
                )}
                <button
                  onClick={() => setShowResponseForm(true)}
                  className="mt-3 text-xs text-blue-600 hover:text-blue-700 underline"
                >
                  Edit Response
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder={t.responsePlaceholder}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none text-sm resize-none"
                  style={{ minHeight: '120px' }}
                />
                <button
                  onClick={handleSendResponse}
                  disabled={!responseText.trim()}
                  className="w-full h-12 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t.sendResponse}
                </button>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full h-11 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
