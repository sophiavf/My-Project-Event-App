// The Firebase Admin SDK to access Firestore.
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

//Import firebase functions
import { logger } from "firebase-functions";

import cleanupOldEvents from "./cleanup";
import updateDatabase from "./update";
import runScraper from "./my-scraper";
import scrapeMeetup from "./my-scraper/scrapers/ScrapeMeetup";
import scrapeEventbrite from "./my-scraper/scrapers/ScrapeEventbrite";

import Event from "./types/Event";
import { onSchedule } from "firebase-functions/v2/scheduler";

const meetupUrl =
	"https://www.meetup.com/find/?location=de--M%C3%BCnchen&source=EVENTS&sortField=RELEVANCE&eventType=inPerson&categoryId=546 ";
const eventbriteUrl =
	"https://www.eventbrite.com/d/germany--m%C3%BCnchen/free--science-and-tech--events/?ang=en";

exports.cleanupEvents = onSchedule("every day 00:00", async () => {
	await cleanupOldEvents(db);
	logger.log("Event cleanup finished");
});

exports.meetupScraper = onSchedule("every day 01:00", async () => {
	const events: Event[] = await runScraper(meetupUrl, scrapeMeetup);
	updateDatabase(events, db);
	logger.log("Event meetup data update finished");
});

exports.eventbriteScraper = onSchedule("every day 02:00", async () => {
	const events = await runScraper(eventbriteUrl, scrapeEventbrite);
	updateDatabase(events, db);
	logger.log("Event eventbrite data update finished");
});

export { meetupUrl, eventbriteUrl };
