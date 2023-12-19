    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";
    import { getStorage } from "firebase/storage";
    import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAq_8f1FIN5M9JWT1sWoW2rc-FuFtEVtfM",
        authDomain: "dinhdai-2003.firebaseapp.com",
        databaseURL: "https://dinhdai-2003-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "dinhdai-2003",
        storageBucket: "dinhdai-2003.appspot.com",
        messagingSenderId: "246649434352",
        appId: "1:246649434352:web:5c99fb62aa265373839235",
        measurementId: "G-HX40C29TDC"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Firebase services
    const db = getFirestore(app);
    const storage = getStorage(app);
    const auth = getAuth(app);


    export {db, storage, auth};
    