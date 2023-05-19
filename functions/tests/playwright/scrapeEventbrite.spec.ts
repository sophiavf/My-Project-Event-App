import { test, expect, chromium, Page } from "@playwright/test";
import { eventbriteUrl } from "../../src/index";

import scrapeEventbrite, {
	getEventData,
	getEventSummary,
	goToNextPage,
} from "../../src/my-scraper/scrapers/ScrapeEventbrite";

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

test("scrapeEventbrite function", async () => {
	const events = await scrapeEventbrite(page);
	expect(events).toBeInstanceOf(Array);
	// Asserts at least one event is found
	expect(events.length).toBeGreaterThan(0);
	// Further assertions can be made about the structure and content of the events.
});

test("getEventData function", async () => {
	const eventElement = await page.$("section.discover-horizontal-event-card"); // Fetch one event element
	if (eventElement) {
		const event = await getEventData(eventElement, page);
		expect(event).toHaveProperty("id");
		expect(event).toHaveProperty("name");
		expect(event).toHaveProperty("eventLink");
	}
});

test("getEventSummary function", async () => {
	const eventElement = await page.$("div.Container_root_5l5cp");
	if (eventElement) {
		const linkElement = await eventElement.$("a.event-card-link");
		const eventLink = linkElement ? await linkElement.getAttribute("href") : "";
		if (eventLink) {
			const summary = await getEventSummary(eventLink, page);
			expect(summary).toBeDefined();
			expect(typeof summary).toBe("string");
		}
	}
});

test("goToNextPage function", async () => {
	const hasNextPage = await goToNextPage(page);
	expect(typeof hasNextPage).toBe("boolean");
});
