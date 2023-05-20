// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCcIuuv1axdjYmdw2THuK6QKpMKVvnkHmU',
  authDomain: 'say-it-5a3bb.firebaseapp.com',
  projectId: 'say-it-5a3bb',
  storageBucket: 'say-it-5a3bb.appspot.com',
  messagingSenderId: '831258435482',
  appId: '1:831258435482:web:a59c5cd5882efddb6b2423',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
