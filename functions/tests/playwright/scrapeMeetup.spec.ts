import { test, expect } from "@playwright/test";
import {
	scrapeMeetup,
	scrapeEventLocation,
	scrollToBottom,
} from "../../src/my-scraper/scrapers/ScrapeMeetup"; // replace with the actual file name
import { meetupUrl } from "../../src";

test("scrollToBottom function", async ({ page }) => {
	// You can replace with an actual meetup page url
	await page.goto(meetupUrl);
	await scrollToBottom(page);

	// This tests if the page has been scrolled to the bottom
	const scrolledHeight = await page.evaluate(() => window.scrollY);
	const bodyHeight = await page.evaluate(() => document.body.scrollHeight);

	expect(scrolledHeight + 720).toEqual(bodyHeight);
});

test("scrapeMeetup function", async ({ page }) => {
	// You can replace with an actual meetup page url
	const events = await scrapeMeetup(page, meetupUrl);
	console.log(events);

	// Test if events is an array
	expect(Array.isArray(events)).toBe(true);

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

test("scrapeEventLocation function", async ({ page }) => {
	// You can replace with an actual meetup event url
	const location = await scrapeEventLocation(page, meetupUrl);

	// Test if location is a string
	expect(typeof location).toBe("string");
});
