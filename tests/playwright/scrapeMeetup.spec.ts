import { test, expect } from "@playwright/test";
import playwright, { Page, BrowserContext, Browser } from "playwright-core";
//Import interfaces
import Event from "../../functions/src/types/Event";

import {
	scrapeMeetup,
	scrollToBottom,
	extractID,
	extractImageUrl,
} from "../../functions/src/my-scraper/scrapers/ScrapeMeetup"; // replace with the actual file name

import { meetupUrl } from "../../functions/src";

// shared test variables
let browser: Browser, context: BrowserContext, page: Page;

let events: Event[];

test.beforeAll(async () => {
	browser = await playwright.chromium.launch();
});

test.afterAll(async () => {
	await browser.close();
});

test.beforeEach(async () => {
	context = await browser.newContext();
	page = await context.newPage();
});

test.afterEach(async () => {
	await context.close();
});

test("scrollToBottom function", async () => {
	// You can replace with an actual meetup page url

	await page.goto(meetupUrl);
	await scrollToBottom(page);

	// This tests if the page has been scrolled to the bottom
	const scrolledHeight = await page.evaluate(() => window.scrollY);
	const bodyHeight = await page.evaluate(() => document.body.scrollHeight);

	expect(scrolledHeight).toEqual(bodyHeight - 720);
});

test("scrapeMeetup function returns an array with the required properties", async () => {
	events = await scrapeMeetup(page, meetupUrl);
	console.log(events);
	console.log(events.length);
	// Test if each event has the correct structure
	events.forEach((event) => {
		expect(event).toHaveProperty("id");
		expect(event).toHaveProperty("name");
		expect(event).toHaveProperty("eventLink");
		expect(event).toHaveProperty("dateTime");
		expect(event).toHaveProperty("location");
		expect(event).toHaveProperty("image");
	});
});
test("scrapeMeetup function returns an array containing atleast 1 event", async () => {
	// Test if events is an array
	expect(Array.isArray(events)).toBe(true);
	expect(events.length).toBeGreaterThan(5);
});

test("scrapeMeetup function returns an array with no duplicates", async () => {
	const ids = events.map((event) => event.id);
	const idsSet = new Set(ids);

	//This test will fail if there are any duplicate ids in the events array, as the size of the ids array will be larger than the size of the idsSet.
	expect(ids.length).toBe(idsSet.size);
});

test("extractID returns a valid ID value", () => {
	const url = "https://www.meetup.com/sgpython/events/277404359/";
	const id = Number(extractID(url));
	expect(id).toBe(277404359);
});

test("extractImageUrl returns a valid image url", async () => {
	await page.goto(meetupUrl);
	const sampleEvent = events[0];
	const sampleImage = await extractImageUrl(page, sampleEvent.id);
	const imageUrlBase = "https://secure.meetupstatic.com/photos/event/";
	// Expect the processed event's image URL to contain the base URL and the event ID
	if (sampleImage) {
		const imageUrlContainsBaseAndId =
			sampleImage.includes(imageUrlBase);

		expect(imageUrlContainsBaseAndId).toBe(true);
	} else {
		console.error("Image URL is null");
	}
});
