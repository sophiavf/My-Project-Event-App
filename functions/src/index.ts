// The Firebase Admin SDK to access Firestore.
import { adminDb } from "./firebaseAdmin";

//Import firebase functions
import { logger } from "firebase-functions";

import cleanupOldEvents from "./cleanup";
import updateDatabase from "./update";
import runScraper from "./my-scraper";
import { scrapeMeetup } from "./my-scraper/scrapers/ScrapeMeetup";
import { scrapeEventbrite } from "./my-scraper/scrapers/ScrapeEventbrite";

import Event from "./types/Event";
import { onSchedule } from "firebase-functions/v2/scheduler";

const funcTimeout: number = 500;
const funcMemory = "1GiB";

const meetupUrl =
	"https://www.meetup.com/find/?location=de--M%C3%BCnchen&source=EVENTS&sortField=RELEVANCE&eventType=inPerson&categoryId=546 ";
const eventbriteUrl =
	"https://www.eventbrite.com/d/germany--m%C3%BCnchen/free--science-and-tech--events/?ang=en";

exports.cleanupEvents = onSchedule(
	{
		schedule: "every day 00:00",
		timeoutSeconds: funcTimeout,
		memory: funcMemory,
	},
	async () => {
		await cleanupOldEvents(adminDb);
		logger.log("Event cleanup finished");
	}
);

exports.meetupScraper = onSchedule(
	{
		schedule: "every day 01:00",
		timeoutSeconds: funcTimeout,
		memory: funcMemory,
	},
	async () => {
		const events: Event[] = await runScraper(meetupUrl, scrapeMeetup);
		await updateDatabase(events, adminDb);
		logger.log("Event meetup data update finished");
	}
);

exports.eventbriteScraper = onSchedule(
	{
		schedule: "every day 02:00",
		timeoutSeconds: funcTimeout,
		memory: funcMemory,
	},
	async () => {
		const events = await runScraper(eventbriteUrl, scrapeEventbrite);
		await updateDatabase(events, adminDb);
		logger.log("Event eventbrite data update finished");
	}
);

export { meetupUrl, eventbriteUrl, adminDb };
