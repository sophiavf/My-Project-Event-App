// The Firebase Admin SDK to access Firestore.
import { adminDb } from "./firebaseAdmin";

//Import firebase functions
import { logger } from "firebase-functions";
import * as functions from "firebase-functions";

import cleanupOldEvents from "./cleanup";
import updateDatabase from "./update";
import runScraper from "./my-scraper";
import { scrapeMeetup } from "./my-scraper/scrapers/ScrapeMeetup";
import { scrapeEventbrite } from "./my-scraper/scrapers/ScrapeEventbrite";

import Event from "./types/Event";

const runtimeOpts = {
	timeoutSeconds: 500,
};

const meetupUrl =
	"https://www.meetup.com/find/?location=de--M%C3%BCnchen&source=EVENTS&sortField=RELEVANCE&eventType=inPerson&categoryId=546 ";
const eventbriteUrl =
	"https://www.eventbrite.com/d/germany--m%C3%BCnchen/free--science-and-tech--events/?ang=en";

exports.cleanupEvents = functions
	.runWith(runtimeOpts)
	.pubsub.schedule("0 0 * * *")
	.timeZone("Europe/Berlin")
	.onRun(async () => {
		await cleanupOldEvents(adminDb);
		logger.log("Event cleanup finished");
	});

exports.meetupScraper = functions
	.runWith(runtimeOpts)
	.pubsub.schedule("0 1 * * *")
	.timeZone("Europe/Berlin")
	.onRun(async () => {
		const events: Event[] = await runScraper(meetupUrl, scrapeMeetup);
		await updateDatabase(events, adminDb);
		logger.log("Event meetup data update finished");
	});

exports.eventbriteScraper = functions
	.runWith(runtimeOpts)
	.pubsub.schedule("0 2 * * *")
	.timeZone("Europe/Berlin")
	.onRun(async () => {
		const events = await runScraper(eventbriteUrl, scrapeEventbrite);
		await updateDatabase(events, adminDb);
		logger.log("Event eventbrite data update finished");
	});

export { meetupUrl, eventbriteUrl, adminDb };
