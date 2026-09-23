import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { Complaint, getAllComplaints, updateComplaintResponse, getComplaintStats, exportToCSV } from '../utils/storage';
import ComplaintModal from './ComplaintModal';

export default function AdminDashboard() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({ total: 0, praise: 0, complaint: 0, responded: 0, pending: 0 });
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = () => {
    const data = getAllComplaints();
    setComplaints(data);
    setStats(getComplaintStats());
  };

  const handleLogout = () => {
    localStorage.removeItem('iro-admin-auth');
    navigate('/admin');
  };

  const handleRespond = (id: string, response: string) => {
    const success = updateComplaintResponse(id, response);
    if (success) {
      loadComplaints();
    }
  };

  const filteredComplaints = filterCategory === 'all'
    ? complaints
    : complaints.filter(c => c.category === filterCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">नेरा</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800">{t.dashboard}</h1>
              <p className="text-[10px] text-gray-500">{t.officeTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
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

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📋</span>
              <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Total Complaints</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">👍</span>
              <span className="text-2xl font-bold text-green-700">{stats.praise}</span>
            </div>
            <p className="text-xs text-green-600 font-medium">{t.praise}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">⚠️</span>
              <span className="text-2xl font-bold text-red-700">{stats.complaint}</span>
            </div>
            <p className="text-xs text-red-600 font-medium">{t.complaint}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">✅</span>
              <span className="text-2xl font-bold text-purple-700">{stats.responded}</span>
            </div>
            <p className="text-xs text-purple-600 font-medium">Responded</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-3 mb-4 border border-gray-100 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['all', 'Praise', 'Suggestion', 'Complaint', 'Grievance'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? `All (${stats.total})` : 
                 cat === 'Praise' ? `${t.praise} (${stats.praise})` :
                 cat === 'Complaint' ? `${t.complaint} (${stats.complaint})` :
                 `${cat} (${complaints.filter(c => c.category === cat).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Complaint List */}
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <span className="text-5xl block mb-3">📭</span>
            <p className="text-gray-500">{t.noFeedbacks}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* ID & Status */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-red-700">{complaint.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        complaint.status === 'Responded' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {complaint.status === 'Responded' ? '✅ Responded' : '⏳ Pending'}
                      </span>
                    </div>

                    {/* Service & Category */}
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
                        {complaint.service}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        complaint.category === 'Praise' ? 'bg-green-100 text-green-700' :
                        complaint.category === 'Suggestion' ? 'bg-blue-100 text-blue-700' :
                        complaint.category === 'Complaint' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {complaint.category}
                      </span>
                    </div>

                    {/* Name & Date */}
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="font-medium">{complaint.name}</span>
                      <span>•</span>
                      <span>{complaint.date}</span>
                    </div>

                    {/* Details Preview */}
                    {complaint.details && (
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                        {complaint.details}
                      </p>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    className="px-4 py-2 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                  >
                    👁 {t.viewDetails}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complaint Modal */}
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onRespond={handleRespond}
        />
      )}
    </div>
  );
}
