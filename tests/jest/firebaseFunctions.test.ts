import { adminDb } from "../../functions/src";
import { expect, test } from "@jest/globals";
import "jest";
const eventsRef = adminDb.collection("events");
import { Timestamp } from "firebase-admin/firestore";
import runScraper from "../../functions/src/my-scraper";
import cleanupOldEvents from "../../functions/src/cleanupOldEvents";
import { removeObsoleteEvents } from "../../functions/src/removeObsoleteEvents";
import { eventbriteUrl, meetupUrl } from "../../functions/src";
import { scrapeMeetup } from "../../functions/src/my-scraper/scrapers/ScrapeMeetup";
import { scrapeEventbrite } from "../../functions/src/my-scraper/scrapers/ScrapeEventbrite";
import updateDatabase from "../../functions/src/update";

import mockEvents from "./mockEvents";

test("runScraper with scrapeEventbrite", async () => {
	const eEvents = await runScraper(eventbriteUrl, scrapeEventbrite);
	await updateDatabase(eEvents, adminDb);
	// Run the obselete events function
	//await removeObsoleteEvents("Eventbrite", eEvents);
	const eQ = await eventsRef.where("eventPlatform", "==", "Eventbrite").get();
	expect(eQ.empty).toBe(false);
}, 190000);
test("runScraper with scrapeMeetup", async () => {
	const mEvents = await runScraper(meetupUrl, scrapeMeetup);
	await updateDatabase(mEvents, adminDb);
	// Run the obselete events function
	//await removeObsoleteEvents("Meetup", mEvents);
	const mQ = await eventsRef.where("eventPlatform", "==", "Meetup").get();
	expect(mQ.empty).toBe(false);
}, 190000);

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
