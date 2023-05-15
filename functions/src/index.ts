// Init cloud Firestore
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

//Import firebase functions
import * as functions from "firebase-functions";

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
		return cleanupOldEvents(db);
	});

exports.meetupScraper = functions.pubsub
	.schedule("01***")
	.onRun(async (context) => {
		const events: Event[] = await runScraper(meetupUrl, scrapeMeetup);
		updateDatabase(events, db);
	});

exports.meetupScraper = functions.pubsub
	.schedule("02***")
	.onRun(async (context) => {
		const events = await runScraper(eventbriteUrl, scrapeEventbrite);
		updateDatabase(events, db);
	});
