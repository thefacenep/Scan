import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFeedback } from '../context/FeedbackContext';
import { translations } from '../translations';
import { Feedback, Category, WaitingTime } from '../types';
import { v4 as uuidv4 } from 'uuid';

function generateCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `IRO-KTW-${num}`;
}

const ratingEmojis = [
  { value: 1, emoji: '😡', label: 'Very Bad' },
  { value: 2, emoji: '😞', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Average' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '🤩', label: 'Excellent' },
];

const waitingTimeOptions: WaitingTime[] = [
  'within_10_min',
  '10min_30min',
  '30min_1hr',
  'more_than_1hr',
  '1_day',
  '2_days',
  'more_than_3_days',
];

export default function FeedbackForm() {
  const { lang, setLang } = useLanguage();
  const { addFeedback } = useFeedback();
  const t = translations[lang];

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  const [contact, setContact] = useState('');
  const [dateOfVisit, setDateOfVisit] = useState('');
  const [category, setCategory] = useState<Category>('complaint');
  const [overallService, setOverallService] = useState(0);
  const [staffBehavior, setStaffBehavior] = useState(0);
  const [waitingTime, setWaitingTime] = useState<WaitingTime | ''>('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  const categories: { key: Category; label: string; color: string }[] = [
    { key: 'praise', label: t.praise, color: 'bg-green-100 text-green-700 border-green-300' },
    { key: 'suggestion', label: t.suggestion, color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { key: 'complaint', label: t.complaint, color: 'bg-red-100 text-red-700 border-red-300' },
    { key: 'grievance', label: t.grievance, color: 'bg-orange-100 text-orange-700 border-orange-300' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const feedback: Feedback = {
      id: uuidv4(),
      code: generateCode(),
      isAnonymous,
      name: isAnonymous ? '' : name,
      pan: isAnonymous ? '' : pan,
      contact: isAnonymous ? '' : contact,
      dateOfVisit,
      category,
      overallService,
      staffBehavior,
      waitingTime,
      description,
      submittedAt: new Date().toISOString(),
      response: '',
    };

    addFeedback(feedback);
    setTrackingCode(feedback.code);
    setShowSuccess(true);

    // Reset form
    setIsAnonymous(false);
    setName('');
    setPan('');
    setContact('');
    setDateOfVisit('');
    setCategory('complaint');
    setOverallService(0);
    setStaffBehavior(0);
    setWaitingTime('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">ने</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800 leading-tight">{t.officeTitle}</h1>
              <p className="text-xs text-gray-500">{t.officeSubtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setLang(lang === 'np' ? 'en' : 'np')}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-100 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors"
          >
            {lang === 'np' ? 'EN' : 'NP'}
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-lg mx-auto px-4 pt-6">
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
            {t.formTitle}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Anonymous Checkbox */}
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer border border-gray-100">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">{t.anonymous}</span>
            </label>

            {/* Name */}
            {!isAnonymous && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.name}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none text-base transition-all"
                />
              </div>
            )}

            {/* PAN */}
            {!isAnonymous && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.pan}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder={t.panPlaceholder}
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none text-base transition-all"
                />
              </div>
            )}

            {/* Contact */}
            {!isAnonymous && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.contact}</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={contact}
                  onChange={(e) => setContact(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder={t.contactPlaceholder}
                  className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none text-base transition-all"
                />
              </div>
            )}

            {/* Date of Visit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.dateOfVisit}</label>
              <input
                type="date"
                value={dateOfVisit}
                onChange={(e) => setDateOfVisit(e.target.value)}
                className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none text-base transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.category}</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`h-12 px-3 rounded-xl border-2 font-medium text-sm transition-all ${
                      category === cat.key
                        ? `${cat.color} border-current shadow-sm scale-[1.02]`
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Overall Service Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.overallService}</label>
              <div className="flex justify-between gap-1">
                {ratingEmojis.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setOverallService(r.value)}
                    className={`flex-1 h-14 rounded-xl text-2xl transition-all transform ${
                      overallService === r.value
                        ? 'bg-yellow-100 scale-110 shadow-md ring-2 ring-yellow-300'
                        : 'bg-gray-50 hover:bg-gray-100 hover:scale-105'
                    }`}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Staff Behavior Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.staffBehavior}</label>
              <div className="flex justify-between gap-1">
                {ratingEmojis.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setStaffBehavior(r.value)}
                    className={`flex-1 h-14 rounded-xl text-2xl transition-all transform ${
                      staffBehavior === r.value
                        ? 'bg-yellow-100 scale-110 shadow-md ring-2 ring-yellow-300'
                        : 'bg-gray-50 hover:bg-gray-100 hover:scale-105'
                    }`}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Waiting Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.waitingTimeQ}</label>
              <div className="grid grid-cols-2 gap-2">
                {waitingTimeOptions.map((wt) => (
                  <button
                    key={wt}
                    type="button"
                    onClick={() => setWaitingTime(wt)}
                    className={`h-12 px-2 rounded-xl border-2 text-xs font-medium transition-all ${
                      waitingTime === wt
                        ? 'bg-purple-100 text-purple-700 border-purple-300 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {(t.waitingOptions as Record<string, string>)[wt]}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Text Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.description}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.descriptionPlaceholder}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none text-base transition-all resize-none"
                style={{ minHeight: '150px' }}
              />
            </div>

            {/* Submit Button - Sticky on mobile */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-14 bg-[#DC143C] text-white text-lg font-bold rounded-xl shadow-lg hover:bg-[#b8102f] active:scale-[0.98] transition-all"
              >
                {t.submit}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-lg mx-auto px-4 py-6 text-center space-y-2">
        <a
          href="/track"
          className="block text-sm text-red-700 hover:text-red-800 font-medium underline"
        >
          🔍 {t.trackBtn}
        </a>
        <a
          href="/admin-login"
          className="block text-xs text-gray-400 hover:text-gray-600 underline"
        >
          {t.staffLogin}
        </a>
      </footer>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-[fadeIn_0.3s_ease]">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{t.successTitle}</h3>
              <p className="text-sm text-gray-600 mb-3">{t.successMsg}</p>
              <div className="bg-gray-100 rounded-xl p-3 mb-5">
                <span className="text-xl font-mono font-bold text-red-700">{trackingCode}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSuccess(false)}
                  className="flex-1 h-12 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  {t.close}
                </button>
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    window.location.href = `/track?track=${trackingCode}`;
                  }}
                  className="flex-1 h-12 bg-red-700 text-white font-medium rounded-xl hover:bg-red-800 transition-colors"
                >
                  {t.trackBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
