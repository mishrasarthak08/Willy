import firebase from 'firebase' 
require('@firebase/firestore')

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCUloU-dcxbFh9hNxW5yDdpbiBrZ3SQq10",
    authDomain: "wily-b4447.firebaseapp.com",
    projectId: "wily-b4447",
    storageBucket: "wily-b4447.appspot.com",
    messagingSenderId: "870892578374",
    appId: "1:870892578374:web:c8f333a11adb5037510c47"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();