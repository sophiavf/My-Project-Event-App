import { Firestore } from "@google-cloud/firestore";
import Event from "../types/Event";

export default async function updateDatabase(
	events: Event[],
	firestore: Firestore
) {
	const batch = firestore.batch();

	for (const event of events) {
		const docRef = firestore.collection("events").doc(event.id.toString());
		batch.set(docRef, event);
	}
	await batch.commit;
}
