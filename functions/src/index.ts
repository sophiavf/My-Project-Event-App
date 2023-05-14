/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import { onRequest } from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
admin.initializeApp();
const firestore = admin.firestore();

import cleanupOldEvents from "./cleanup";
import updateDatabase from "./update";
import runScraper from "./my-scraper";
import scrapeMeetup from "./my-scraper/scrapers/ScrapeMeetup";
import scrapeEventbrite from "./my-scraper/scrapers/ScrapeEventbrite";

import Event from "./types/Event";

const tZone = "Europe/Paris";
const meetupUrl =
	"https://www.meetup.com/find/?location=de--M%C3%BCnchen&source=EVENTS&sortField=RELEVANCE&eventType=inPerson&categoryId=546 ";
const eventbriteUrl =
	"https://www.eventbrite.com/d/germany--m%C3%BCnchen/free--science-and-tech--events/?ang=en";

exports.cleanup = functions.pubsub
	.schedule("00***")
	.timeZone(tZone)
	.onRun((context) => {
		return cleanupOldEvents(firestore);
	});

exports.meetupScraper = functions.pubsub
	.schedule("01***")
	.onRun(async (context) => {
		const events: Event[] = await runScraper(meetupUrl, scrapeMeetup);
		updateDatabase(events, firestore);
	});

exports.meetupScraper = functions.pubsub
	.schedule("02***")
	.onRun(async (context) => {
		const events = await runScraper(eventbriteUrl, scrapeEventbrite);
	});
