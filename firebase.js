import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const db = getFirestore(app);

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

const status =
    document.getElementById("userStatus");

onAuthStateChanged(auth, async (user)=>{

    if(user){

        status.textContent = "Signed in as " + user.displayName;

        loginBtn.hidden = true;
        logoutBtn.hidden = false;

    }else{

        status.textContent =
            "Not signed in";

        loginBtn.hidden = false;
        logoutBtn.hidden = true;

    }

});

const logoutBtn =
    document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", ()=>{

    signOut(auth);

});

console.log("Firebase connected!");
console.log(db);

export {auth, db};