import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp();

const db = getFirestore(app);

export default db;
