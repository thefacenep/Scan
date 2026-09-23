# Firebase Setup Guide for IRO Koteshwor Feedback System

## Overview
This application now uses **Firebase Firestore** for cloud-based complaint storage, enabling real-time sync across all devices.

---

## 🔥 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"** → Enter project name (e.g., `iro-koteshwor`)
3. Disable Google Analytics (optional) → Click **Create Project**

---

## 🔥 Step 2: Enable Firestore Database

1. In Firebase Console, go to **Build → Firestore Database**
2. Click **"Create Database"**
3. Select **"Start in test mode"** (we'll add security rules later)
4. Choose location closest to Nepal (e.g., `asia-south1` - Mumbai)
5. Click **Enable**

---

## 🔥 Step 3: Get Firebase Configuration

1. In Firebase Console, click the **⚙️ gear icon** → **Project Settings**
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to add a web app
4. Enter app nickname: `IRO Koteshwor Feedback`
5. Click **Register App**
6. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "iro-koteshwor.firebaseapp.com",
  projectId: "iro-koteshwor",
  storageBucket: "iro-koteshwor.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

## 🔥 Step 4: Add Configuration to Code

Open `src/firebase.ts` and replace the placeholder values:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // ← Your API Key
  authDomain: "iro-koteshwor.firebaseapp.com",      // ← Your Auth Domain
  projectId: "iro-koteshwor",                        // ← Your Project ID
  storageBucket: "iro-koteshwor.appspot.com",        // ← Your Storage Bucket
  messagingSenderId: "123456789012",                 // ← Your Sender ID
  appId: "1:123456789012:web:abcdef1234567890"       // ← Your App ID
};
```

---

## 🔥 Step 5: Set Up Security Rules (IMPORTANT!)

In Firebase Console → **Firestore Database → Rules**, replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow anyone to read and write complaints (public feedback system)
    match /complaints/{complaintId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;  // For admin responses
      allow delete: if false; // Prevent deletion
    }
  }
}
```

Click **Publish** to save rules.

> ⚠️ **Note**: These rules allow public read/write for a feedback system. For production, consider adding Firebase Authentication for admin operations.

---

## 🔥 Step 6: Deploy

### Option A: Vercel (Recommended)
1. Push code to GitHub
2. Connect repo to Vercel
3. Deploy — Firebase will work automatically

### Option B: Netlify
1. Push code to GitHub
2. Connect repo to Netlify
3. Deploy — Firebase will work automatically

### Option C: Local Development
```bash
npm run dev
```

---

## ✅ How It Works Now

### For Users (Mobile/Desktop):
1. User fills feedback form on their phone
2. Complaint is saved to **Firebase Firestore** (cloud database)
3. User gets tracking code (e.g., `IRO-KTW-20250115-4523`)
4. User can track status from any device using the code

### For Admin (Desktop):
1. Admin logs in at `/admin`
2. Dashboard **automatically loads** all complaints from Firestore
3. **Real-time updates** — new complaints appear instantly without refresh
4. Admin can respond to complaints
5. Responses are saved to Firestore and visible to users immediately

---

## 📊 Firestore Data Structure

Collection: `complaints`

Each document contains:
```json
{
  "id": "IRO-KTW-20250115-4523",
  "date": "2025-01-15",
  "service": "Help Desk",
  "category": "Complaint",
  "name": "Ram Bahadur",
  "pan": "123456789",
  "contact": "9800000000",
  "email": "ram@example.com",
  "serviceRating": 4,
  "staffRating": 5,
  "waitingTime": "१० मिनेटभित्र",
  "details": "Service was slow...",
  "status": "Pending",
  "response": null,
  "responseDate": null,
  "createdAt": "Timestamp"
}
```

---

## 🔍 Troubleshooting

### "Permission denied" errors:
- Check Firestore Security Rules (Step 5)
- Ensure rules are published

### "Failed to submit" errors:
- Verify Firebase config in `src/firebase.ts`
- Check browser console for detailed errors
- Ensure project is not deleted/disabled

### Complaints not showing in admin:
- Check browser console for Firestore connection errors
- Verify real-time listener is working
- Refresh the page

### Data not syncing across devices:
- This is the whole point of Firebase! If not working:
  - Check internet connection
  - Verify Firebase config is correct
  - Check Firestore console to see if data exists

---

## 💰 Firebase Free Tier Limits

- **Firestore**: 50K reads/day, 20K writes/day, 20K deletes/day
- **Storage**: 1 GB stored, 10 GB/month transfer
- **More than enough** for a government office feedback system

---

## 🚀 Next Steps (Optional Enhancements)

1. **Add Firebase Authentication** for secure admin access
2. **Add Firestore Indexes** for better query performance
3. **Enable Firestore Persistence** for offline support
4. **Add Cloud Functions** for email notifications
5. **Set up Firebase Hosting** for custom domain

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Firebase project is active
3. Check Firestore console for data
4. Review Firebase documentation: https://firebase.google.com/docs/firestore

---

**Last Updated**: 2025-01-15
**Firebase SDK Version**: Latest (installed via npm)
