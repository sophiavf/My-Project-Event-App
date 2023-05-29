import { adminDb } from "../../functions/src";
import { expect, test } from "@jest/globals";
import "jest";

const eventsRef = adminDb.collection("events");

import runScraper from "../../functions/src/my-scraper";
import cleanupOldEvents from "../../functions/src/cleanup";

import { eventbriteUrl, meetupUrl } from "../../functions/src";

import { scrapeMeetup } from "../../functions/src/my-scraper/scrapers/ScrapeMeetup";
import { scrapeEventbrite } from "../../functions/src/my-scraper/scrapers/ScrapeEventbrite";
import updateDatabase from "../../functions/src/update";
import { Timestamp } from "firebase-admin/firestore";

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

test("cleanup database", async () => {
	const batch = adminDb.batch();

	const now = new Date();
	const twentyFourHoursAgo = Timestamp.fromDate(
		new Date(now.getTime() - 24 * 60 * 60 * 1000)
	);
	const moreThanDayAgo = Timestamp.fromDate(
		new Date(now.getTime() - 25 * 60 * 60 * 1000)
	);

	const testEvents = [
		{ id: "testing1", dateTime: twentyFourHoursAgo, name: "value1" },
		{ id: "testing2", dateTime: moreThanDayAgo, name: "value2" },
		{ id: "testing3", dateTime: now, name: "value3" },
	];

	for (const event of testEvents) {
		const docRef = adminDb.collection("events").doc(event.id.toString());
		batch.set(docRef, event);
	}
	try {
		await batch.commit();
		console.log("Batch write to Firestore successful");
	} catch (error) {
		console.error("Error writing batch to Firestore: ", error);
	}

	// Cleanup old events
	await cleanupOldEvents(adminDb);

	// Query for events older than 24 hours
	const q = await eventsRef.where("dateTime", "<=", twentyFourHoursAgo).get();

	// Make sure no such events exist
	expect(q.empty).toBe(true);
}, 190000);
