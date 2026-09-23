import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function AdminLogin() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === 'IRO-KOTESHWOR' && password === 'Nepal@123') {
      localStorage.setItem('iro-admin-auth', 'true');
      navigate('/dashboard');
    } else {
      setError(t.loginError);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border border-gray-100">
        <div className="text-center mb-6">
          {/* Text Hierarchy - Centered */}
          <div className="mb-4">
            <p className="text-[10px] text-red-700 leading-tight">
              नेपाल सरकार / Government of Nepal
            </p>
            <p className="text-[11px] text-red-700 leading-tight">
              अर्थ मन्त्रालय / Ministry of Finance
            </p>
            <p className="text-xs text-red-700 leading-tight font-medium">
              आन्तरिक राजस्व विभाग / Inland Revenue Department
            </p>
            <p className="text-sm text-red-700 leading-tight font-extrabold">
              आन्तरिक राजस्व कार्यालय, कोटेश्वर
            </p>
            <p className="text-xs text-red-700 leading-tight font-semibold italic">
              Inland Revenue Office, Koteshwor
            </p>
          </div>
          <h2 className="text-lg font-bold text-gray-800">{t.staffLogin}</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.loginId}</label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => { setLoginId(e.target.value); setError(''); }}
              className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none text-base"
              placeholder="IRO-KOTESHWOR"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-red-700 text-white font-bold rounded-xl hover:bg-red-800 transition-colors shadow-md"
          >
            {t.login}
          </button>
        </form>

        <div className="mt-5 text-center">
          <a href="/" className="text-xs text-gray-400 hover:text-gray-600 underline">
            ← {t.backToForm}
          </a>
        </div>
      </div>
    </div>
  );
}
