import { adminDb } from "../../functions/src";
import { expect, test } from "@jest/globals";
import "jest";
const eventsRef = adminDb.collection("events");
const pageEndsRef = adminDb.collection("paginationSnapshots");
import Event from "../../functions/src/types/Event";
import runScraper from "../../functions/src/my-scraper";
import cleanupOldEvents from "../../functions/src/cleanup";
import { eventbriteUrl, meetupUrl } from "../../functions/src";
import { scrapeMeetup } from "../../functions/src/my-scraper/scrapers/ScrapeMeetup";
import { scrapeEventbrite } from "../../functions/src/my-scraper/scrapers/ScrapeEventbrite";
import calculatePageEnds from "../../functions/src/calculatePageEnds/index";
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

test("Should generate page ends for every 20th event", async () => {
	const eventsSnapshot = await eventsRef.count().get();
	const eventCount = eventsSnapshot.data().count;
	const expectedPages = Math.floor(eventCount / 20);
	// run function
	await calculatePageEnds(adminDb);

	// check that the number of documents in the collection
	const pageEndSnapshot = await pageEndsRef.count().get();
	const actualPages = pageEndSnapshot.data().count;

	expect(actualPages).toBe(expectedPages);

	//checks that each doc contains the right information

	const docSnapshot = await pageEndsRef.get();
	const docs = docSnapshot.docs.map((doc) => doc.data());

	docs.forEach((doc) =>
		expect(doc).toEqual(
			expect.objectContaining({
				page: expect.any(Number),
				endDocId: expect.any(String),
			})
		)
	);
}, 190000);
