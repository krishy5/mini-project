# Firebase Setup Guide

## 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `campus-connect`
4. Follow the setup wizard

## 2. Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method

## 3. Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode**
4. Choose your location

## 4. Setup Frontend Configuration
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register your app
5. Copy the `firebaseConfig` object
6. Create `.env` file in project root:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 5. Setup Backend (Firebase Admin)
1. In Firebase Console, go to **Project Settings** > **Service Accounts**
2. Click "Generate new private key"
3. Save the JSON file as `serviceAccountKey.json` in the `server/` directory
4. **IMPORTANT**: Add `serviceAccountKey.json` to `.gitignore`

## 6. Firestore Security Rules
In Firestore Database > Rules, add:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /student_profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /clubs/{clubId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## 7. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd server
npm install
```

## 8. Run the Application
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

## Collections Structure

### students
- `student_id`: string
- `email`: string
- `created_at`: timestamp

### student_profiles
- `student_id`: string
- `phone`: string
- `semester`: string
- `skills`: array
- `experiences`: array
- `certificates`: array

### jobs
- `title`: string
- `company`: string
- `description`: string
- `requirements`: array
- `created_at`: timestamp

### events
- `title`: string
- `description`: string
- `date`: timestamp
- `location`: string

### clubs
- `name`: string
- `description`: string
- `members`: array


## Firestore Security Rules

Add these rules in Firebase Console → Firestore Database → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /student_profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /event_registrations/{registrationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /clubs/{clubId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```
