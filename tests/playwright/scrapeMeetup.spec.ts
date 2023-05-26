import { test, expect } from "@playwright/test";
import {
	scrapeMeetup,
	scrapeEventLocation,
	scrollToBottom,
} from "../../functions/src/my-scraper/scrapers/ScrapeMeetup"; // replace with the actual file name

import { meetupUrl } from "../../functions/src";

import Event from "../../functions/src/types/Event";

test.describe("Meetup event scraper", () => {
	let events: Event[];

	test.beforeAll(async ({ page }) => {
		test.setTimeout(2000000);
		events = await scrapeMeetup(page, meetupUrl);
	});
	test("scrollToBottom function", async ({ page }) => {
		// You can replace with an actual meetup page url
		await page.goto(meetupUrl);
		await scrollToBottom(page);

		// This tests if the page has been scrolled to the bottom
		const scrolledHeight = await page.evaluate(() => window.scrollY);
		const bodyHeight = await page.evaluate(() => document.body.scrollHeight);

		expect(scrolledHeight).toEqual(bodyHeight);
	});

	test("scrapeMeetup function returns an array with the required properties", async ({
		page,
	}) => {
		// You can replace with an actual meetup page url
		console.log(events);
		console.log(events.length);

		// Test if events is an array
		expect(Array.isArray(events)).toBe(true);
		expect(events).toBeGreaterThan(5);

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

	test("scrapeMeetup returns an array with no duplicates", async ({ page }) => {
		const ids = events.map((event) => event.id);
		const idsSet = new Set(ids);

		//This test will fail if there are any duplicate ids in the events array, as the size of the ids array will be larger than the size of the idsSet. because when you create a Set, it automatically removes duplicates, only storing unique values.
		expect(ids.length).toBe(idsSet.size);
	});

	test("scrapeEventLocation function", async ({ page }) => {
		const eventUrl =
			"https://www.meetup.com/tableau-user-group-munich/events/292275193/";

		// You can replace with an actual meetup event url
		const location = await scrapeEventLocation(page, meetupUrl);
		console.log(location);

		// Test if location is a string
		expect(typeof location).toBe("string");
	});
});
