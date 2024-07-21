// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyA733fvz3rpsQe4nTjkWP8Sc4pDoBj9cFs",
    authDomain: "miscarded.firebaseapp.com",
    projectId: "miscarded",
    storageBucket: "miscarded.appspot.com",
    messagingSenderId: "608757041283",
    appId: "1:608757041283:web:0abe17581bc8d9aab173b6",
    measurementId: "G-9BP1TZND5X"
  };

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
