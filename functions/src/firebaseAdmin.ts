import * as admin from "firebase-admin";
import { getApps } from "firebase-admin/app";
import serviceAccountJson from "../serviceAccountKey.json";

const serviceAccount = serviceAccountJson as admin.ServiceAccount;

if (!getApps().length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount)
	});
}

const adminDb = admin.firestore(); 
adminDb.settings({ ignoreUndefinedProperties: true });
export { adminDb };
