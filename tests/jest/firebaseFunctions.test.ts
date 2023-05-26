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

test("runScraper with scrapeEventbrite", async () => {
	const eEvents = await runScraper(eventbriteUrl, scrapeEventbrite);
	await updateDatabase(eEvents, adminDb);
	const eQ = await eventsRef.where("eventPlatform", "==", "Eventbrite").get();
	expect(eQ.empty).toBe(false);
}, 855000);
test("runScraper with scrapeMeetup", async () => {
	const mEvents = await runScraper(meetupUrl, scrapeMeetup);
	await updateDatabase(mEvents, adminDb);
	const mQ = await eventsRef.where("eventPlatform", "==", "Meetup").get();
	expect(mQ.empty).toBe(false);
}, 1000000);

test("cleanup database", async () => {
	await cleanupOldEvents(adminDb);

	const now = new Date();
	const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
	// Query for events older than 24 hours
	const q = await eventsRef.where("dateTime", "<=", twentyFourHoursAgo).get();

	// Make sure no such events exist
	expect(q.empty).toBe(true);
}, 10000);
