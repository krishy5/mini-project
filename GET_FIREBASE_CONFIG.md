# How to Get Firebase Config Values

## Step-by-Step:

1. Go to https://console.firebase.google.com/

2. Click "Add project" (or select existing project)

3. Enter project name → Click Continue → Click "Create project"

4. Once created, click the **Web icon** `</>` (in Project Overview page)

5. Register app → Give it a nickname → Click "Register app"

6. You'll see a code block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",              // Copy this
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

7. Copy these values to your `.env` file:

```
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

8. **Enable Authentication:**
   - In Firebase Console, go to "Authentication" → "Get started"
   - Click "Email/Password" → Enable it → Save

9. **Create Firestore Database:**
   - Go to "Firestore Database" → "Create database"
   - Choose "Start in test mode" → Select location → Enable

10. Restart your dev server: `npm run dev`

Done! ✅
