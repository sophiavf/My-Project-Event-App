import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
const app = initializeApp();

const adminDb = getFirestore(app);

adminDb.settings({ ignoreUndefinedProperties: true });
export { adminDb };
