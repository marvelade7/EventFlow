import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Load Firebase configuration from environment variables (Vite expects VITE_ prefix)
// If Firebase config is not provided (for example in a preview deploy),
// initializeApp can throw and crash the whole app. Guard initialization
// so the frontend still loads without Firebase in that case.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let auth = null;
let googleProvider = null;

try {
    if (!firebaseConfig.apiKey) throw new Error("Missing Firebase API key");
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
} catch (err) {
    // Log a warning but don't crash the app; components should handle a null `auth`.
    // This prevents a white/blank page when environment variables are not set.
    // In production, prefer setting the correct Vercel env vars for Firebase.
    // eslint-disable-next-line no-console
    console.warn("Firebase not initialized:", err.message || err);
}

export { auth, googleProvider };

