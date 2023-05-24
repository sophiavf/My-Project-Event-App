import {
	getEvents,
	goToNextPage,
	processEvents,
} from "../../src/my-scraper/scrapers/eventbriteXHR";
import { test, expect, chromium, Page, Browser } from "@playwright/test";
import { eventbriteUrl } from "../../src/index";

import { readFileSync } from "fs";
import { join } from "path";
const dataFilePath = join(__dirname, "../eventData.json");
const rawData = readFileSync(dataFilePath, "utf-8");
const data = JSON.parse(rawData);

test.use({
	contextOptions: {
		userAgent:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64)" +
			" AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
	},
});

let page: Page;
let browser: Browser;
let context;
test.beforeAll(async () => {
	browser = await chromium.launch();
	context = await browser.newContext();
	page = await context.newPage();
});

// test.afterAll(async () => {
// 	await page.close();
// });

// test.beforeEach(async () => {

// });
test("Page is opened", async () => {
	await page.goto(eventbriteUrl);
	expect(await page.url()).toBe(eventbriteUrl);
});

test("getEvents returns an array", async () => {
	const events = await getEvents(page, eventbriteUrl);
	console.log(events);
	expect(Array.isArray(events)).toBe(true);
});

test("goToNextPage returns a boolean", async () => {
	const hasNextPage = await goToNextPage(page);
	expect(typeof hasNextPage).toBe("boolean");
});

test("processEvents returns an array", () => {
	console.log(typeof data);

	const processedEvents = processEvents(data);
	expect(Array.isArray(processedEvents)).toBe(true);
});
// Test for the getEvents function
test("getEvents should return valid Event objects", async () => {
	const events = await getEvents(page, eventbriteUrl);
	for (const event of events) {
		// Add your validations here, for example:
		expect(event).toHaveProperty("id");
		expect(event).toHaveProperty("name");
	}
});

// Test for the goToNextPage function
test("goToNextPage should navigate to the next page", async () => {
	await page.goto(eventbriteUrl);
	const initialUrl = page.url();
	const hasNextPage = await goToNextPage(page);
	await page.waitForURL;
	const newUrl = page.url();

	expect(hasNextPage).toBe(true);
	expect(initialUrl).not.toBe(newUrl);
});

test("getEvents returns an array with no duplicates", async () => {
	const events = await getEvents(page, eventbriteUrl);
	const eventsSet = new Set(events);
	expect(events.length).toBe(eventsSet.size);
});
