import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCgWtbbZxzwd6RhcpVhBgrbGLLK4lJLxfc",
	authDomain: "my-tech-event-aggregator.firebaseapp.com",
	projectId: "my-tech-event-aggregator",
	storageBucket: "my-tech-event-aggregator.appspot.com",
	messagingSenderId: "1090087767285",
	appId: "1:1090087767285:web:866731446e497742d449bc",
};
const firebaseApp = initializeApp(firebaseConfig);
// https://firebase.google.com/docs/firestore/quickstart#web-version-9_1
const db = getFirestore(firebaseApp);
export default db;
