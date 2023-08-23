import {
	scrapeEventbrite,
	goToNextPage,
	processEvents,
} from "../../functions/src/my-scraper/scrapers/ScrapeEventbrite";
import { test, expect } from "@playwright/test";
import playwright, { Page, BrowserContext, Browser } from "playwright-core";
import { eventbriteUrl } from "../../functions/src/index";

// // Annotate entire file as serial.
// test.describe.configure({ mode: "serial" });

//Import interfaces
import Event from "../../functions/src/types/Event";

//import test json data
import { readFileSync } from "fs";
import { join } from "path";
import { Timestamp } from "@google-cloud/firestore";
const dataFilePath = join(__dirname, "./eventbriteTestData.json");
const rawData = readFileSync(dataFilePath, "utf-8");
const data = JSON.parse(rawData);

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

test("EventBrite page is opened", async () => {
	await page.goto(eventbriteUrl);
	expect(await page.url()).toBe(eventbriteUrl);
});

test("scrapeEventbrite returns an array containing atleast 1 event", async () => {
	events = await scrapeEventbrite(page, eventbriteUrl);
	console.log(events);
	expect(Array.isArray(events)).toBe(true);
	expect(events.length).toBeGreaterThan(0);
});

test("processEvents returns an array", () => {
	console.log(typeof data);
	const processedEvents = processEvents(data);
	expect(Array.isArray(processedEvents)).toBe(true);
	expect(processedEvents.length).toBeGreaterThan(0);
	expect(processedEvents[0]).toHaveProperty("id");
	expect(processedEvents[1].name).toBe("Business Event");
});
// Test for the scrapeEventbrite function
test("scrapeEventbrite should return valid Event objects", async () => {
	console.log(events);
	for (const event of events) {
		expect(event).toHaveProperty("id");
		expect(event).toHaveProperty("name");
		expect(event).toHaveProperty("eventLink");
		expect(event).toHaveProperty("dateTime");
		expect(event).toHaveProperty("location");
		expect(event).toHaveProperty("image");
	}
});

test("scrapeEventbrite returns an array with no duplicates", async () => {
	const ids = events.map((event) => event.id);
	const idsSet = new Set(ids);
	//This test will fail if there are any duplicate ids in the events array, as the size of the ids array will be larger than the size of the idsSet.
	expect(ids.length).toBe(idsSet.size);
});

// Test for the goToNextpage function
test("goToNextpage should navigate to the next page", async () => {
	await page.goto(eventbriteUrl);
	const initialUrl = page.url();
	const hasNextpage = await goToNextPage(page);
	await page.waitForURL;
	const newUrl = page.url();

	expect(hasNextpage).toBe(true);
	expect(initialUrl).not.toBe(newUrl);
});

test("goToNextpage returns a boolean", async () => {
	const hasNextpage = await goToNextPage(page);
	expect(typeof hasNextpage).toBe("boolean");
	expect(hasNextpage).toBe(true);
});
