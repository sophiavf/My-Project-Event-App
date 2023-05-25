import {
	scrapeEventbrite,
	goToNextPage,
	processEvents,
} from "../../src/my-scraper/scrapers/ScrapeEventbrite";
import { test, expect, chromium, Page, Browser } from "@playwright/test";
import { eventbriteUrl } from "../../src/index";

import { readFileSync } from "fs";
import { join } from "path";
const dataFilePath = join(__dirname, "../eventbriteTestData.json");
const rawData = readFileSync(dataFilePath, "utf-8");
const data = JSON.parse(rawData);

test("Page is opened", async ({ page }) => {
	await page.goto(eventbriteUrl);
	expect(await page.url()).toBe(eventbriteUrl);
});

test("scrapeEventbrite returns an array", async ({ page }) => {
	const events = await scrapeEventbrite(page, eventbriteUrl);
	console.log(events);
	expect(Array.isArray(events)).toBe(true);
});

test("goToNextPage returns a boolean", async ({ page }) => {
	const hasNextPage = await goToNextPage(page);
	expect(typeof hasNextPage).toBe("boolean");
});

test("processEvents returns an array", () => {
	console.log(typeof data);

	const processedEvents = processEvents(data);
	expect(Array.isArray(processedEvents)).toBe(true);
});
// Test for the scrapeEventbrite function
test("scrapeEventbrite should return valid Event objects", async ({ page }) => {
	const events = await scrapeEventbrite(page, eventbriteUrl);
	for (const event of events) {
		// Add your validations here, for example:
		expect(event).toHaveProperty("id");
		expect(event).toHaveProperty("name");
	}
});

// Test for the goToNextPage function
test("goToNextPage should navigate to the next page", async ({ page }) => {
	await page.goto(eventbriteUrl);
	const initialUrl = page.url();
	const hasNextPage = await goToNextPage(page);
	await page.waitForURL;
	const newUrl = page.url();

	expect(hasNextPage).toBe(true);
	expect(initialUrl).not.toBe(newUrl);
});

test("scrapeEventbrite returns an array with no duplicates", async ({
	page,
}) => {
	const events = await scrapeEventbrite(page, eventbriteUrl);
	const eventsSet = new Set(events);
	expect(events.length).toBe(eventsSet.size);
});
