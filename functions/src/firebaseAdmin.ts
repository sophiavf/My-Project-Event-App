import * as admin from "firebase-admin";
import serviceAccountJson from "../serviceAccountKey.json";

const serviceAccount = serviceAccountJson as admin.ServiceAccount;
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const adminDb = admin.firestore();
adminDb.settings({ ignoreUndefinedProperties: true });
export { adminDb };
