import {
	getEvents,
	goToNextPage,
	processEvents,
} from "../../src/my-scraper/scrapers/eventbriteXHR"; // make sure to replace this with the correct path
import { test, expect, chromium, Page } from "@playwright/test";
import { eventbriteUrl } from "../../src/index";

import * as data from "../eventData.json";

test.use({
	contextOptions: {
		userAgent:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64)" +
			" AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
	},
});

let page: Page;
test.beforeAll(async () => {
	const browser = await chromium.launch();
	const context = await browser.newContext();
	page = await context.newPage();
});

// test.afterAll(async () => {
// 	await page.close();
// });

test.beforeEach(async () => {
	await page.goto(eventbriteUrl);
});
test("Page is opened", async () => {
	expect(await page.url()).toBe(eventbriteUrl);
});

test("getEvents returns an array", async () => {
	const events = await getEvents(page);
	console.log(events);
	expect(Array.isArray(events)).toBe(true);
});

test("goToNextPage returns a boolean", async () => {
	const hasNextPage = await goToNextPage(page);
	expect(typeof hasNextPage).toBe("boolean");
});

test("processEvents returns an array", () => {
	const rawEvents = data;
	const processedEvents = processEvents(rawEvents);
	expect(Array.isArray(processedEvents)).toBe(true);
});

// Test for the getEvents function
test("getEvents should return valid Event objects", async () => {
	await page.goto(eventbriteUrl);
	const events = await getEvents(page);
	for (const event of events) {
		// Add your validations here, for example:
		expect(event).toHaveProperty("id");
		expect(event).toHaveProperty("name");
	}
});
