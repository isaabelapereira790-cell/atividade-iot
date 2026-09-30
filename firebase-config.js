import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyD42Mv47AAAhmjQ5gC3FlIF8XYbJDIAl1o",
    authDomain: "isaiot1.firebaseapp.com",
    projectId: "isaiot1",
    storageBucket: "isaiot1.firebasestorage.app",
    messagingSenderId: "981528957277",
    appId: "1:981528957277:web:3d700a2bcb22ca142098b4"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export const db = getFirestore(app);
