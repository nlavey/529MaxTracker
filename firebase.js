import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyBHuNEFAP-cLupB4CMK4UOx1uoZwa93-2s",
    authDomain: "maxtracker-6ac72.firebaseapp.com",
    projectId: "maxtracker-6ac72",
    storageBucket: "maxtracker-6ac72.firebasestorage.app",
    messagingSenderId: "259006425952",
    appId: "1:259006425952:web:d3b297479119cacd4e4c05",
    measurementId: "G-3BWCHNBT2T"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const loginBtn =
    document.getElementById("googleLogin");

loginBtn.addEventListener("click", async () => {

    try {

        await signInWithPopup(auth, provider);

    }
    catch(error){

        console.error(error);

    }

});

console.log("Firebase connected!");