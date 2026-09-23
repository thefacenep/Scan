import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { Category, WaitingTime, ServiceType } from '../types';
import { saveComplaint, generateComplaintId, Complaint } from '../utils/storage';
import Header from './Header';

const ratingEmojis = [
  { value: 1, emoji: '😞' },
  { value: 2, emoji: '😕' },
  { value: 3, emoji: '😐' },
  { value: 4, emoji: '😊' },
  { value: 5, emoji: '😃' },
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

const waitingTimeColors = [
  'bg-green-100 border-green-300 text-green-800',
  'bg-emerald-100 border-emerald-300 text-emerald-800',
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-yellow-100 border-yellow-300 text-yellow-800',
  'bg-orange-100 border-orange-300 text-orange-800',
  'bg-amber-100 border-amber-300 text-amber-800',
  'bg-red-100 border-red-300 text-red-800',
];

const serviceTypes: ServiceType[] = [
  'help_desk',
  'tax_clearance',
  'pdcr',
  'file_transfer',
  'personal_pan',
  'business_pan',
  'business_close',
  'business_deregistration',
  'scheme_apply',
  'vat_adjustment',
  'due_clearance',
  'bank_reactivation',
  'tax_audit',
  'investigation',
  'complaint',
  'others',
];

export default function FeedbackForm() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>('help_desk');
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfVisit, setDateOfVisit] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>('complaint');
  const [overallService, setOverallService] = useState(0);
  const [staffBehavior, setStaffBehavior] = useState(0);
  const [waitingTime, setWaitingTime] = useState<WaitingTime | ''>('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  const categories: { key: Category; label: string; activeColor: string }[] = [
    { key: 'praise', label: t.praise, activeColor: 'bg-green-500 text-white shadow-lg shadow-green-200' },
    { key: 'suggestion', label: t.suggestion, activeColor: 'bg-blue-500 text-white shadow-lg shadow-blue-200' },
    { key: 'complaint', label: t.complaint, activeColor: 'bg-red-500 text-white shadow-lg shadow-red-200' },
    { key: 'grievance', label: t.grievance, activeColor: 'bg-orange-500 text-white shadow-lg shadow-orange-200' },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    // Map service type to display name
    const serviceNames: Record<ServiceType, string> = {
      help_desk: 'Help Desk',
      tax_clearance: 'Tax Clearance',
      pdcr: 'PDCR',
      file_transfer: 'File Transfer',
      personal_pan: 'Personal PAN',
      business_pan: 'Business PAN',
      business_close: 'Business Close',
      business_deregistration: 'Business Deregistration & PAN Down gradation',
      scheme_apply: 'Scheme Apply',
      vat_adjustment: 'VAT Adjustment Letter',
      due_clearance: 'Due Clearance',
      bank_reactivation: 'Reactivation of closed bank account',
      tax_audit: 'Tax Audit',
      investigation: 'Investigation',
      complaint: 'Complaint',
      others: 'Other',
    };

    // Map category to display name
    const categoryNames: Record<Category, string> = {
      praise: 'Praise',
      suggestion: 'Suggestion',
      complaint: 'Complaint',
      grievance: 'Grievance',
    };

    // Map waiting time to display text
    const waitingTimeTexts: Record<WaitingTime, string> = {
      within_10_min: '१० मिनेटभित्र',
      '10min_30min': '१० मिनेट-आधा घण्टा',
      '30min_1hr': 'आधा घण्टा-१ घण्टा',
      more_than_1hr: '१ घण्टा भन्दा बढी',
      '1_day': '१ दिन',
      '2_days': '२ दिन',
      more_than_3_days: '३ दिन भन्दा बढी',
    };

    const complaintId = generateComplaintId();

    const complaint: Complaint = {
      id: complaintId,
      date: new Date().toISOString().split('T')[0],
      service: serviceNames[serviceType],
      category: categoryNames[category],
      name: isAnonymous ? 'Anonymous' : (name || 'Anonymous'),
      pan: isAnonymous ? '' : pan,
      contact: isAnonymous ? '' : contact,
      email: isAnonymous ? '' : email,
      serviceRating: overallService,
      staffRating: staffBehavior,
      waitingTime: waitingTime ? waitingTimeTexts[waitingTime] : '',
      details: description,
      status: 'Pending',
      response: null,
      responseDate: null,
    };

    const success = await saveComplaint(complaint);
    
    if (success) {
      setTrackingCode(complaintId);
      setShowSuccess(true);

      // Reset form
      setIsAnonymous(false);
      setServiceType('help_desk');
      setName('');
      setPan('');
      setContact('');
      setEmail('');
      setDateOfVisit(new Date().toISOString().split('T')[0]);
      setCategory('complaint');
      setOverallService(0);
      setStaffBehavior(0);
      setWaitingTime('');
      setDescription('');
    } else {
      setSubmitError(lang === 'np' 
        ? 'प्रतिकृया पेश गर्न असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।' 
        : 'Failed to submit feedback. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-indigo-50 pb-28">
      {/* Header */}
      <Header 
        showLangToggle={true}
        lang={lang}
        onLangToggle={() => setLang(lang === 'np' ? 'en' : 'np')}
        subtitle={t.officeSubtitle}
      />

      {/* Form */}
      <main className="max-w-lg mx-auto px-4 pt-5">
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 border border-gray-100">
          {/* Form Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-800">{t.formTitle}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{t.formTitleEn}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Service Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t.serviceLabel}
              </label>
              <p className="text-xs text-gray-400 mb-2">{t.serviceLabelEn}</p>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
                className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none text-base bg-white transition-all appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
              >
                {serviceTypes.map((st) => (
                  <option key={st} value={st}>
                    {(t.serviceOptions as Record<string, string>)[st]}
                  </option>
                ))}
              </select>
            </div>

            {/* Anonymous Checkbox */}
            <label className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">{t.anonymous}</span>
                <span className="text-xs text-gray-400 block">{t.anonymousEn}</span>
              </div>
            </label>

            {/* Personal Fields */}
            {!isAnonymous && (
              <>
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

                <div className="grid grid-cols-2 gap-3">
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.email}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none text-base transition-all"
                  />
                </div>
              </>
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
                    className={`h-12 px-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                      category === cat.key
                        ? cat.activeColor
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Overall Service Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-0.5">{t.overallService}</label>
              <p className="text-xs text-gray-400 mb-3">{t.overallServiceEn}</p>
              <div className="flex justify-between gap-1.5">
                {ratingEmojis.map((r, idx) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setOverallService(r.value)}
                    className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all transform ${
                      overallService === r.value
                        ? 'bg-yellow-50 scale-110 shadow-lg ring-2 ring-yellow-300'
                        : 'bg-gray-50 hover:bg-gray-100 hover:scale-105'
                    }`}
                  >
                    <span className="text-3xl drop-shadow-md" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{r.emoji}</span>
                    <span className="text-[9px] mt-1 text-gray-500 font-medium">
                      {(t.ratingLabels as Record<number, string>)[r.value]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Staff Behavior Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-0.5">{t.staffBehavior}</label>
              <p className="text-xs text-gray-400 mb-3">{t.staffBehaviorEn}</p>
              <div className="flex justify-between gap-1.5">
                {ratingEmojis.map((r, idx) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setStaffBehavior(r.value)}
                    className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all transform ${
                      staffBehavior === r.value
                        ? 'bg-yellow-50 scale-110 shadow-lg ring-2 ring-yellow-300'
                        : 'bg-gray-50 hover:bg-gray-100 hover:scale-105'
                    }`}
                  >
                    <span className="text-3xl drop-shadow-md" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{r.emoji}</span>
                    <span className="text-[9px] mt-1 text-gray-500 font-medium">
                      {(t.ratingLabels as Record<number, string>)[r.value]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Waiting Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-0.5">{t.waitingTimeQ}</label>
              <p className="text-xs text-gray-400 mb-3">{t.waitingTimeEn}</p>
              <div className="grid grid-cols-2 gap-2">
                {waitingTimeOptions.map((wt, idx) => (
                  <button
                    key={wt}
                    type="button"
                    onClick={() => setWaitingTime(wt)}
                    className={`h-12 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                      waitingTime === wt
                        ? `${waitingTimeColors[idx]} shadow-md scale-[1.02] ring-2 ring-offset-1 ring-current/20`
                        : `${waitingTimeColors[idx]} opacity-70 hover:opacity-100`
                    }`}
                  >
                    <span className="block">{(t.waitingOptions as Record<string, string>)[wt]}</span>
                    <span className="block text-[9px] opacity-70">{(t.waitingOptionsEn as Record<string, string>)[wt]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description Text Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-0.5">{t.description}</label>
              <p className="text-xs text-gray-400 mb-2">{t.descriptionEn}</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.descriptionPlaceholder}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none text-base transition-all resize-none"
                style={{ minHeight: '150px' }}
              />
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <span>❌</span> {submitError}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-[#DC143C] text-white text-lg font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-[#b8102f] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    {lang === 'np' ? 'पेश गर्दै...' : 'Submitting...'}
                  </span>
                ) : (
                  <>{t.submit} / {t.submitEn}</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-6 pb-4 space-y-4">
          {/* Contact Info */}
          <div className="bg-white/80 rounded-xl p-4 border border-gray-100 text-center space-y-2">
            <p className="text-xs text-gray-500">📍 {t.location}</p>
            <p className="text-xs text-gray-500">
              📞{' '}
              <a href="tel:01-519296" className="text-red-700 hover:underline">०१-५१९२९६</a>,{' '}
              <a href="tel:01-519947" className="text-red-700 hover:underline">०१-५१९९४७</a>,{' '}
              <a href="tel:01-5199348" className="text-red-700 hover:underline">०१-५१९९३४८</a>
            </p>
            <p className="text-xs text-gray-500">
              ✉️{' '}
              <a href="mailto:iro-koteshwor@ird.gov.np" className="text-red-700 hover:underline">
                iro-koteshwor@ird.gov.np
              </a>
            </p>
          </div>

          {/* Key Staff */}
          <div className="bg-white/80 rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-600 text-center mb-2">{t.keyStaff}</p>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-700 font-medium">{t.staff1}</span>
                <span className="text-gray-500">{t.staff1Role}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-700 font-medium">{t.staff2}</span>
                <span className="text-gray-500">{t.staff2Role}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex justify-center gap-4">
            <a
              href="/track"
              className="text-xs text-red-700 hover:text-red-800 font-medium underline"
            >
              🔍 {t.trackBtn}
            </a>
            <a
              href="/qr-print"
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              📱 {t.printQR}
            </a>
            <a
              href="/admin"
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              🔐 {t.staffLogin}
            </a>
          </div>
        </footer>
      </main>

      {/* Sticky Submit on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 sm:hidden z-30">
        <button
          type="button"
          onClick={() => {
            const form = document.querySelector('form') as HTMLFormElement;
            if (form) {
              form.requestSubmit();
            }
          }}
          className="w-full h-12 bg-[#DC143C] text-white text-base font-bold rounded-xl shadow-lg active:scale-[0.98] transition-transform"
        >
          {t.submit} / {t.submitEn}
        </button>
      </div>

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
              <div className="bg-gray-100 rounded-xl p-4 mb-5">
                <span className="text-2xl font-mono font-bold text-red-700">{trackingCode}</span>
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
