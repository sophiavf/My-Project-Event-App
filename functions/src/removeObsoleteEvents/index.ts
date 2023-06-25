import Event from "../types/Event";
import { adminDb } from "../firebaseAdmin";
import { eventsRef } from "..";
// removes events which are no longer found by the scrapers possible due to the organizer changing certain parameters which
export async function removeObsoleteEvents(
	platform: string,
	scrapedEvents: Event[]
) {
	try {
		// Retrieve all existing events for the relevant event platform from Firebase
		const snapshot = await eventsRef
			.where("eventPlatform", "==", platform)
			.get();
		snapshot.forEach(async (docu: any) => {
			const event = docu.data();
			// gets the unique ID to compare with
			const eventId = event.id;
			// check if this event is in the scrapedEvents array
			const existsInscraped = scrapedEvents.some(
				(scrapedEvent) => scrapedEvent.id === eventId
			);

			// if not in scrapedEvents, remove from Firestore
			if (!existsInscraped) {
				await adminDb.collection("events").doc(docu.id).delete();
			}
		});
	} catch (error) {
		console.error("Error removing obselete events: ", error);
	}
}
