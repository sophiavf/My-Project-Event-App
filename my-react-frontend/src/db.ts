import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCgWtbbZxzwd6RhcpVhBgrbGLLK4lJLxfc",
	authDomain: "my-tech-event-aggregator.firebaseapp.com",
	projectId: "my-tech-event-aggregator",
	storageBucket: "my-tech-event-aggregator.appspot.com",
	messagingSenderId: "1090087767285",
	appId: "1:1090087767285:web:866731446e497742d449bc",
};
// checks if app was already initialized 
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// https://firebase.google.com/docs/firestore/quickstart#web-version-9_1
const db = getFirestore(app);

export default db;
