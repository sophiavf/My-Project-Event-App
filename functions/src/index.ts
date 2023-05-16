// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// import { logger } from "firebase-functions";
// import { onRequest } from "firebase-functions/v2/https";
// import { onDocumentCreated } from "firebase-functions/v2/firestore";

// The Firebase Admin SDK to access Firestore.
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

//Import firebase functions
import * as functions from "firebase-functions";
import { logger } from "firebase-functions";

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
		cleanupOldEvents(db);
		logger.log("Event cleanup finished");
	});

exports.meetupScraper = functions.pubsub
	.schedule("01***")
	.onRun(async (context) => {
		const events: Event[] = await runScraper(meetupUrl, scrapeMeetup);
		updateDatabase(events, db);
		logger.log("Event meetup data update finished");
	});

exports.eventbriteScraper = functions.pubsub
	.schedule("02***")
	.onRun(async (context) => {
		const events = await runScraper(eventbriteUrl, scrapeEventbrite);
		updateDatabase(events, db);
		logger.log("Event eventbrite data update finished");
	});
