import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

const db = getFirestore();

export default db;
