import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBN7uk7PQaS0E0Q8jsNiaibLk0OevW9VmI",
  authDomain: "scan-deb79.firebaseapp.com",
  projectId: "scan-deb79",
  storageBucket: "scan-deb79.firebasestorage.app",
  messagingSenderId: "1080514700753",
  appId: "1:1080514700753:web:6316cbd9a2f7a3a4edecf0",
  measurementId: "G-LB5NTTB2EC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
