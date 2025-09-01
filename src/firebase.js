import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// הדבק כאן את הפרטים מה־Firebase Console
// Firebase Console → Project → Build → Authentication/Firestore
// Project Overview → לחץ על אייקון </> (Web App) → Copy config
const firebaseConfig = {
  apiKey: "AIzaSyATJQHKylhOjNxCjuvKTEAwKN6Ff6rA0y8",
  authDomain: "dogpacer-9526e.firebaseapp.com",
  projectId: "dogpacer-9526e",
  storageBucket: "dogpacer-9526e.firebasestorage.app",
  messagingSenderId: "866242790915",
  appId: "1:866242790915:web:7c9c080b9fdfa3fd2bf036"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)