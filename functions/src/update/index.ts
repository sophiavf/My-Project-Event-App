import Event from "../types/Event";

export default async function updateDatabase(
	events: Event[],
	db: FirebaseFirestore.Firestore
) {
	const batch = db.batch();

	for (const event of events) {
		const docRef = db.collection("events").doc(event.id.toString());
		batch.set(docRef, event);
	}

	try {
		await batch.commit;
		console.log("Batch write to Firestore successful");
	} catch (error) {
		console.error("Error writing batch to Firestore: ", error);
	}
}
