import * as admin from "firebase-admin";
//import serviceAccountJson from "../serviceAccountKey.json";
//const serviceAccount = serviceAccountJson as admin.ServiceAccount;
// Need to use the below import instead when running Jest tests
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const adminDb = admin.firestore();
adminDb.settings({ ignoreUndefinedProperties: true });
export { adminDb };