import { adminDb } from "../../functions/src";
import { expect, test } from "@jest/globals";
import "jest";
const eventsRef = adminDb.collection("events");
import { Timestamp } from "firebase-admin/firestore";
import Event from "../../functions/src/types/Event";
import runScraper from "../../functions/src/my-scraper";
import cleanupOldEvents from "../../functions/src/cleanup";
import { eventbriteUrl, meetupUrl } from "../../functions/src";
import { scrapeMeetup } from "../../functions/src/my-scraper/scrapers/ScrapeMeetup";
import { scrapeEventbrite } from "../../functions/src/my-scraper/scrapers/ScrapeEventbrite";
import updateDatabase from "../../functions/src/update";

test("runScraper with scrapeEventbrite", async () => {
	const eEvents = await runScraper(eventbriteUrl, scrapeEventbrite);
	await updateDatabase(eEvents, adminDb);
	const eQ = await eventsRef.where("eventPlatform", "==", "Eventbrite").get();
	expect(eQ.empty).toBe(false);
}, 190000);
test("runScraper with scrapeMeetup", async () => {
	const mEvents = await runScraper(meetupUrl, scrapeMeetup);
	await updateDatabase(mEvents, adminDb);
	const mQ = await eventsRef.where("eventPlatform", "==", "Meetup").get();
	expect(mQ.empty).toBe(false);
}, 190000);

// function createMockEvent(eventId: number, hoursAgo: number): Event {
// 	const now = Date.now();
// 	const pastTimestamp = admin.firestore.Timestamp.fromMillis(
// 		now - hoursAgo * 60 * 60 * 1000
// 	);

// 	return {
// 		id: eventId,
// 		writeTimestamp: pastTimestamp,
// 		eventPlatform: "Test Platform",
// 		name: `Test Event ${eventId}`,
// 		eventLink: `https://test.com/event/${eventId}`,
// 		dateTime: pastTimestamp,
// 		location: "Test Location",
// 		summary: `Test Summary ${eventId}`,
// 		organizer: `Test Organizer ${eventId}`,
// 		image: `https://test.com/image/${eventId}.jpg`,
// 	};
// }

test("should delete all events older than 24 hours", async () => {
	const oneDayOldTimestamp = Date.now() - 86400000;
	// Run the cleanup function
	await cleanupOldEvents(adminDb);
	// Query for events older than 24 hours
	const query = eventsRef.where("dateTime", "<", oneDayOldTimestamp);
	const snapshot = await query.get();
	// Make sure no such events exist
	expect(snapshot.size).toBe(0);
}, 190000);
