import { initializeApp } from "firebase/app";
import {
	getFirestore ,
	connectFirestoreEmulator,
} from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCgWtbbZxzwd6RhcpVhBgrbGLLK4lJLxfc",
	authDomain: "my-tech-event-aggregator.firebaseapp.com",
	projectId: "my-tech-event-aggregator",
	storageBucket: "my-tech-event-aggregator.appspot.com",
	messagingSenderId: "1090087767285",
	appId: "1:1090087767285:web:866731446e497742d449bc"
  };

let db;

//configures to use the local host if emulator is running 
if (location.host === "localhost") {
	//https://firebase.google.com/docs/emulator-suite/connect_firestore#web-version-9
	db = getFirestore();
	connectFirestoreEmulator(db, "localhost", 8080);
} else {
	// https://firebase.google.com/docs/firestore/quickstart#web-version-9_1
	const app = initializeApp(firebaseConfig);
	db = getFirestore(app);
}

export default db;
