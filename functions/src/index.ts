// The Firebase Admin SDK to access Firestore.
import { adminDb } from "./firebaseAdmin";

//Import firebase functions
import { setGlobalOptions } from "firebase-functions/v2";

import { logger } from "firebase-functions";
import { onSchedule } from "firebase-functions/v2/scheduler";

// Import functions 
import cleanupOldEvents from "./cleanupOldEvents";
import updateDatabase from "./update";
import runScraper from "./my-scraper";
import { scrapeMeetup } from "./my-scraper/scrapers/ScrapeMeetup";
import { scrapeEventbrite } from "./my-scraper/scrapers/ScrapeEventbrite";
import { removeObsoleteEvents } from "./removeObsoleteEvents";

import Event from "./types/Event";
const eventsRef = adminDb.collection("events");

const funcTimeout = 3000;
const funcMemory = "1GiB"; //https://firebase.google.com/docs/reference/functions/2nd-gen/node/firebase-functions.md#memoryoption
const funcRegion = "europe-west1"; // Frankfurt, Germany https://firebase.google.com/docs/functions/locations

setGlobalOptions({
	timeoutSeconds: funcTimeout,
	memory: funcMemory,
	region: funcRegion,
});

const meetupUrl =
	"https://www.meetup.com/find/?location=de--M%C3%BCnchen&source=EVENTS&sortField=RELEVANCE&eventType=inPerson&categoryId=546 ";
const eventbriteUrl =
	"https://www.eventbrite.com/d/germany--m%C3%BCnchen/free--science-and-tech--events/?ang=en";

exports.cleanupEvents = onSchedule("every day 00:00", async () => {
	await cleanupOldEvents(adminDb);
	logger.log("Event cleanup finished");
});

exports.meetupScraper = onSchedule("every day 01:00", async () => {
	const events: Event[] = await runScraper(meetupUrl, scrapeMeetup);
	await updateDatabase(events, adminDb);
	await removeObsoleteEvents("Meetup", events);
	logger.log("Event meetup data update finished");
});

exports.eventbriteScraper = onSchedule("every day 02:00", async () => {
	const events = await runScraper(eventbriteUrl, scrapeEventbrite);
	await updateDatabase(events, adminDb);
	await removeObsoleteEvents("Eventbrite", events);
	logger.log("Event eventbrite data update finished");
});

export { meetupUrl, eventbriteUrl, adminDb, eventsRef };
