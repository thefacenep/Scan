import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

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

const COLLECTION_NAME = 'complaints';

export function generateComplaintId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(1000 + Math.random() * 9000));
  return `IRO-KTW-${year}${month}${day}-${random}`;
}

// Save complaint to Firestore
export async function saveComplaint(complaint: Complaint): Promise<boolean> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...complaint,
      createdAt: Timestamp.now()
    });
    
    console.log(`[Firestore] ✅ Complaint saved with ID: ${docRef.id}`);
    return true;
  } catch (error) {
    console.error('[Firestore] ❌ Error saving complaint:', error);
    return false;
  }
}

// Get all complaints (one-time fetch)
export async function getAllComplaints(): Promise<Complaint[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const complaints: Complaint[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Complaint[];
    
    console.log(`[Firestore] Loaded ${complaints.length} complaints`);
    return complaints;
  } catch (error) {
    console.error('[Firestore] Error fetching complaints:', error);
    return [];
  }
}

// Subscribe to real-time updates
export function subscribeToComplaints(
  callback: (complaints: Complaint[]) => void,
  errorCallback?: (error: Error) => void
): () => void {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const complaints: Complaint[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Complaint[];
      
      console.log(`[Firestore] Real-time update: ${complaints.length} complaints`);
      callback(complaints);
    }, (error) => {
      console.error('[Firestore] Snapshot error:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('[Firestore] Error setting up listener:', error);
    if (errorCallback) {
      errorCallback(error as Error);
    }
    return () => {};
  }
}

// Update complaint response
export async function updateComplaintResponse(
  complaintId: string, 
  response: string
): Promise<boolean> {
  try {
    const complaintRef = doc(db, COLLECTION_NAME, complaintId);
    
    await updateDoc(complaintRef, {
      response: response,
      status: 'Responded',
      responseDate: new Date().toISOString().split('T')[0]
    });
    
    console.log(`[Firestore] ✅ Response saved for complaint: ${complaintId}`);
    return true;
  } catch (error) {
    console.error('[Firestore] ❌ Error updating response:', error);
    return false;
  }
}

// Get complaint by ID
export async function getComplaintById(id: string): Promise<Complaint | null> {
  try {
    // Query by the id field since we're storing it as a field in the document
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    
    const complaint = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Complaint))
      .find(c => c.id === id);
    
    return complaint || null;
  } catch (error) {
    console.error('[Firestore] Error fetching complaint:', error);
    return null;
  }
}

// Get statistics
export function getComplaintStats(complaints: Complaint[]) {
  return {
    total: complaints.length,
    praise: complaints.filter(c => c.category === 'Praise').length,
    complaint: complaints.filter(c => c.category === 'Complaint').length,
    responded: complaints.filter(c => c.status === 'Responded').length,
    pending: complaints.filter(c => c.status === 'Pending').length,
  };
}

// Export to CSV (same as before)
export function exportToCSV(complaints: Complaint[]): void {
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
