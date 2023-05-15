import Event from "../types/Event";

export default async function updateDatabase(events: Event[], db: FirebaseFirestore.Firestore) {
	const batch = db.batch();

	for (const event of events) {
		const docRef = db.collection("events").doc(event.id.toString());
		batch.set(docRef, event);
	}
	await batch.commit;
}
