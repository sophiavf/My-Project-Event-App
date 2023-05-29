import { Firestore } from "firebase-admin/firestore";
import Event from "../types/Event";

// This method either creates a new document with the provided data if the document doesn't exist or completely replaces the document data if the document does exist. It means it will overwrite events which already exist in the database with the same id, and add events which do not exist.
export default async function updateDatabase(
	events: Event[],
	db: Firestore
) {
	
	const batch = db.batch();

	for (const event of events) {
		const docRef = db.collection("events").doc(event.id.toString());
		batch.set(docRef, event);
	}

	try {
		await batch.commit();
		console.log("Batch write to Firestore successful");
	} catch (error) {
		console.error("Error writing batch to Firestore: ", error);
	}
}
