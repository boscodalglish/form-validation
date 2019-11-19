import firebase from 'firebase'

const Config = {
    apiKey: "AIzaSyD_w8fpqtgiYtKHcqGDm_vUYbAo9GVkuT0",
    authDomain: "form-validation-c4d32.firebaseapp.com",
    databaseURL: "https://form-validation-c4d32.firebaseio.com/",
    projectId: "form-validation-c4d32",
    storageBucket: "",
    messagingSenderId: "199789786071",
    appId: "1:199789786071:web:434a8abd3530c6bf"
  };
  firebase.initializeApp(Config);
  export const provider = new firebase.auth.GoogleAuthProvider();
  export const auth = firebase.auth();
  export default firebase;