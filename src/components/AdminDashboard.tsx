import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { 
  Complaint, 
  subscribeToComplaints, 
  updateComplaintResponse, 
  getComplaintStats, 
  exportToCSV 
} from '../utils/storage';
import ComplaintModal from './ComplaintModal';

// Complaint Card Component
interface ComplaintCardProps {
  complaint: Complaint;
  lang: string;
  t: any;
  onViewDetails: () => void;
}

function ComplaintCard({ complaint, lang, t, onViewDetails }: ComplaintCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
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

          {/* Details/Comment Preview - PROMINENT */}
          {complaint.details && (
            <div className="mt-2 bg-gray-50 rounded-lg p-2.5 border-l-4 border-blue-400">
              <p className="text-[10px] font-semibold text-blue-700 mb-0.5">💬 {lang === 'np' ? 'विवरण/टिप्पणी' : 'Details/Comment'}:</p>
              <p className="text-xs text-gray-700 line-clamp-3 leading-relaxed">
                {complaint.details}
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onViewDetails}
          className="px-4 py-2 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
        >
          👁 {t.viewDetails}
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({ total: 0, praise: 0, complaint: 0, responded: 0, pending: 0 });
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribe = subscribeToComplaints(
      (data) => {
        setComplaints(data);
        setStats(getComplaintStats(data));
        setIsLoading(false);
        setLastRefresh(new Date());
      },
      (error) => {
        console.error('[Dashboard] Firestore error:', error);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('iro-admin-auth');
    navigate('/admin');
  };

  const handleRespond = async (firestoreId: string, response: string): Promise<void> => {
    if (!firestoreId) {
      console.error('[Dashboard] ❌ No Firestore ID provided');
      alert(lang === 'np' ? 'जवाफ पठाउन असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।' : 'Failed to send response. Please try again.');
      return;
    }
    
    const success = await updateComplaintResponse(firestoreId, response);
    
    if (success) {
      // Show success message
      alert(lang === 'np' ? 'जवाफ सफलतापूर्वक पठाइयो!' : 'Response sent successfully!');
      // Real-time listener will automatically update the UI
    } else {
      // Show error message
      alert(lang === 'np' ? 'जवाफ पठाउन असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।' : 'Failed to send response. Please try again.');
    }
  };

  const handleExport = () => {
    exportToCSV(complaints);
  };

  const filteredComplaints = filterCategory === 'all'
    ? complaints
    : complaints.filter(c => c.category === filterCategory);

  // Group complaints by date
  const groupByDate = (complaints: Complaint[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups = {
      today: [] as Complaint[],
      yesterday: [] as Complaint[],
      thisWeek: [] as Complaint[],
      older: [] as Complaint[]
    };

    complaints.forEach(complaint => {
      // Parse the date from the complaint (format: YYYY-MM-DD)
      const complaintDate = new Date(complaint.date);
      complaintDate.setHours(0, 0, 0, 0);

      if (complaintDate.getTime() === today.getTime()) {
        groups.today.push(complaint);
      } else if (complaintDate.getTime() === yesterday.getTime()) {
        groups.yesterday.push(complaint);
      } else if (complaintDate >= weekAgo) {
        groups.thisWeek.push(complaint);
      } else {
        groups.older.push(complaint);
      }
    });

    return groups;
  };

  const groupedComplaints = groupByDate(filteredComplaints);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b-2 border-[#DC143C]">
        <div className="max-w-6xl mx-auto px-4 py-4">
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
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
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
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Data Status Indicator */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span className="text-xs text-blue-700 font-medium">
                  {lang === 'np' ? 'लोड हुँदैछ...' : 'Loading...'}
                </span>
              </>
            ) : (
              <>
                <span className="text-sm">📊</span>
                <span className="text-xs text-blue-700 font-medium">
                  {complaints.length} {lang === 'np' ? 'उजुरी' : 'complaint'}{complaints.length !== 1 ? (lang === 'np' ? 'हरू' : 's') : ''} {lang === 'np' ? 'लोड भयो' : 'loaded'} (Real-time)
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] text-blue-500">
            {lastRefresh.toLocaleTimeString()}
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📋</span>
              <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">{lang === 'np' ? 'जम्मा' : 'Total'}</p>
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
            <p className="text-xs text-purple-600 font-medium">{lang === 'np' ? 'जवाफ दिइएको' : 'Responded'}</p>
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
                {cat === 'all' ? `${lang === 'np' ? 'सबै' : 'All'} (${stats.total})` : 
                 cat === 'Praise' ? `${t.praise} (${stats.praise})` :
                 cat === 'Complaint' ? `${t.complaint} (${stats.complaint})` :
                 `${cat} (${complaints.filter(c => c.category === cat).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Complaint List */}
        {isLoading ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <p className="text-gray-500">{lang === 'np' ? 'उजुरीहरू लोड हुँदैछन्...' : 'Loading complaints...'}</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <span className="text-5xl block mb-3">📭</span>
            <p className="text-gray-500">{t.noFeedbacks}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Today's Complaints */}
            {groupedComplaints.today.length > 0 && (
              <div>
                <div className="sticky top-0 z-10 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-t-xl shadow-md">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">
                      {lang === 'np' ? 'आज' : 'Today'}
                    </h3>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {groupedComplaints.today.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 bg-green-50 p-3 rounded-b-xl">
                  {groupedComplaints.today.map((complaint) => (
                    <ComplaintCard 
                      key={complaint.id} 
                      complaint={complaint} 
                      lang={lang} 
                      t={t}
                      onViewDetails={() => setSelectedComplaint(complaint)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday's Complaints */}
            {groupedComplaints.yesterday.length > 0 && (
              <div>
                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-t-xl shadow-md">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">
                      {lang === 'np' ? 'हिजो' : 'Yesterday'}
                    </h3>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {groupedComplaints.yesterday.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 bg-blue-50 p-3 rounded-b-xl">
                  {groupedComplaints.yesterday.map((complaint) => (
                    <ComplaintCard 
                      key={complaint.id} 
                      complaint={complaint} 
                      lang={lang} 
                      t={t}
                      onViewDetails={() => setSelectedComplaint(complaint)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* This Week's Complaints */}
            {groupedComplaints.thisWeek.length > 0 && (
              <div>
                <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-t-xl shadow-md">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">
                      {lang === 'np' ? 'यो हप्ता' : 'This Week'}
                    </h3>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {groupedComplaints.thisWeek.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 bg-purple-50 p-3 rounded-b-xl">
                  {groupedComplaints.thisWeek.map((complaint) => (
                    <ComplaintCard 
                      key={complaint.id} 
                      complaint={complaint} 
                      lang={lang} 
                      t={t}
                      onViewDetails={() => setSelectedComplaint(complaint)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Older Complaints */}
            {groupedComplaints.older.length > 0 && (
              <div>
                <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-t-xl shadow-md">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">
                      {lang === 'np' ? 'पुरानो' : 'Older'}
                    </h3>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {groupedComplaints.older.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 bg-gray-50 p-3 rounded-b-xl">
                  {groupedComplaints.older.map((complaint) => (
                    <ComplaintCard 
                      key={complaint.id} 
                      complaint={complaint} 
                      lang={lang} 
                      t={t}
                      onViewDetails={() => setSelectedComplaint(complaint)}
                    />
                  ))}
                </div>
              </div>
            )}
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
