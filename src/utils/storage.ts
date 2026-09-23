export interface Complaint {
  id: string;
  date: string;
  service: string;
  category: string;
  name: string;
  pan: string;
  contact: string;
  email: string;
  serviceRating: number;
  staffRating: number;
  waitingTime: string;
  details: string;
  status: 'Pending' | 'Responded';
  response: string | null;
  responseDate: string | null;
}

const STORAGE_KEY = 'iro_complaints';

export function generateComplaintId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(1000 + Math.random() * 9000));
  return `IRO-KTW-${year}${month}${day}-${random}`;
}

export function getAllComplaints(): Complaint[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      console.log('[Storage] No complaints found in localStorage');
      return [];
    }
    const parsed = JSON.parse(data);
    console.log(`[Storage] Loaded ${parsed.length} complaints from localStorage`);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('[Storage] Error reading complaints from localStorage:', error);
    return [];
  }
}

export function saveComplaint(complaint: Complaint): boolean {
  try {
    const complaints = getAllComplaints();
    complaints.unshift(complaint); // Add to beginning
    
    const jsonString = JSON.stringify(complaints);
    localStorage.setItem(STORAGE_KEY, jsonString);
    
    // Verify the save was successful
    const verify = localStorage.getItem(STORAGE_KEY);
    if (verify) {
      console.log(`[Storage] ✅ Complaint saved successfully: ${complaint.id}`);
      console.log(`[Storage] Total complaints now: ${complaints.length}`);
      
      // Dispatch a custom event so other components can react
      window.dispatchEvent(new CustomEvent('complaint-saved', { detail: complaint }));
      
      return true;
    } else {
      console.error('[Storage] ❌ Save verification failed');
      return false;
    }
  } catch (error) {
    console.error('[Storage] ❌ Error saving complaint to localStorage:', error);
    return false;
  }
}

export function updateComplaintResponse(id: string, response: string): boolean {
  try {
    const complaints = getAllComplaints();
    const index = complaints.findIndex(c => c.id === id);
    
    if (index === -1) {
      console.error(`[Storage] Complaint not found: ${id}`);
      return false;
    }
    
    complaints[index].response = response;
    complaints[index].status = 'Responded';
    complaints[index].responseDate = new Date().toISOString().split('T')[0];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    console.log(`[Storage] ✅ Response saved for: ${id}`);
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('complaint-updated', { detail: complaints[index] }));
    
    return true;
  } catch (error) {
    console.error('[Storage] ❌ Error updating complaint response:', error);
    return false;
  }
}

export function getComplaintById(id: string): Complaint | undefined {
  const complaints = getAllComplaints();
  return complaints.find(c => c.id === id);
}

export function getComplaintStats() {
  const complaints = getAllComplaints();
  return {
    total: complaints.length,
    praise: complaints.filter(c => c.category === 'Praise').length,
    complaint: complaints.filter(c => c.category === 'Complaint').length,
    responded: complaints.filter(c => c.status === 'Responded').length,
    pending: complaints.filter(c => c.status === 'Pending').length,
  };
}

export function exportToCSV(): void {
  const complaints = getAllComplaints();
  
  if (complaints.length === 0) {
    alert('No complaints to export');
    return;
  }

  const headers = [
    'ID',
    'Date',
    'Service',
    'Category',
    'Name',
    'PAN',
    'Contact',
    'Email',
    'Service Rating',
    'Staff Rating',
    'Waiting Time',
    'Details',
    'Status',
    'Response',
    'Response Date'
  ];

  const rows = complaints.map(c => [
    c.id,
    c.date,
    c.service,
    c.category,
    c.name,
    c.pan,
    c.contact,
    c.email,
    c.serviceRating.toString(),
    c.staffRating.toString(),
    c.waitingTime,
    c.details.replace(/"/g, '""'),
    c.status,
    c.response ? c.response.replace(/"/g, '""') : '',
    c.responseDate || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `IRO-Koteshwor-Complaints-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
