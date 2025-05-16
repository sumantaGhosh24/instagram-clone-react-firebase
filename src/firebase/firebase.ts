import firebase from "firebase/compat/app";
import {connectAuthEmulator, getAuth} from "firebase/auth";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";
import {connectStorageEmulator, getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const app = firebase.initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth();

export const storage = getStorage(app);

if (window.location.hostname == "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}
