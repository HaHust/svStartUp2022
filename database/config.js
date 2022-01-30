import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyDYgry7Z3UtznCwVnviLDl4xGzwa-LCGz0",
    authDomain: "arduinostt.firebaseapp.com",
    databaseURL: "https://arduinostt-default-rtdb.firebaseio.com",
    projectId: "arduinostt",
    storageBucket: "arduinostt.appspot.com",
    messagingSenderId: "464610815846",
    appId: "1:464610815846:web:98c74202cd6ea96e74a2a7",
    measurementId: "G-2HV3XYE4NJ"
  };
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase
