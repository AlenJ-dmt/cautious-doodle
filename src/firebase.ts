import firebase from "firebase";
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDjoTMal1sMijkRbQkDaPR1Nyf0GWre4g",
  authDomain: "messenger-15c25.firebaseapp.com",
  projectId: "messenger-15c25",
  storageBucket: "messenger-15c25.appspot.com",
  messagingSenderId: "70308539568",
  appId: "1:70308539568:web:b4557719e93243d1dbdf75",
  measurementId: "G-9EVR8H3QML",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider, db };
export default db;
