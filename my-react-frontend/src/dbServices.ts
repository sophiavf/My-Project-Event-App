import {
	collection,
	query,
	orderBy,
	startAfter,
	limit,
	getDocs,
	QuerySnapshot,
	getCountFromServer,
	where,
} from "firebase/firestore";
import db from "./db";

const eventsRef = collection(db, "events");

async function getEvents(
	page: number,
	pageEnds: Map<number, any>,
	eventsPerPage: number
): Promise<QuerySnapshot | null> {
	let eventQuery;
	if (page === 1) {
		eventQuery = query(eventsRef, orderBy("dateTime"), limit(eventsPerPage));
	} else if (pageEnds.has(page - 1)) {
		eventQuery = query(
			eventsRef,
			orderBy("dateTime"),
			startAfter(pageEnds.get(page - 1)),
			limit(eventsPerPage)
		);
	} else {
		return null;
	}
	const eventsSnapshot = await getDocs(eventQuery);

	return eventsSnapshot;
}
async function getTotalEventCount() {
	const eventTotal = await getCountFromServer(eventsRef);
	return eventTotal.data().count;
}
async function getEventPlatformCounts() {
	const meetup: number = await fetchPlatformCount("Meetup");
	const eventbrite: number = await fetchPlatformCount("Eventbrite");
	return [meetup, eventbrite];
}
async function fetchPlatformCount(platform: string) {
	const eventsRef = collection(db, "events");
	const platformQuery = query(
		eventsRef,
		where("eventPlatform", "==", platform)
	);
	const snapshot = await getCountFromServer(platformQuery);
	return snapshot.data().count;
}
export { getEvents, getTotalEventCount, getEventPlatformCounts };
