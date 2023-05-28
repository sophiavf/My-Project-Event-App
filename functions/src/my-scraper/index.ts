import { chromium, Page } from "playwright";

import Event from "../types/Event.js";

const MIN_DELAY = 0.5; // minimum delay between requests in seconds
const MAX_DELAY = 2; // maximum delay between requests in seconds

async function randomDelay() {
	const delay = Math.floor(
		Math.random() * (MAX_DELAY - MIN_DELAY + 1) + MIN_DELAY
	);
	await new Promise((resolve) => setTimeout(resolve, delay * 1000));
}

export default async function runScraper(
	url: string,
	callBack: (page: Page, url: string) => Promise<Event[]>
): Promise<Event[]> {
	const browser = await chromium.launch();
	//Prevents the site from blocking requests
	const context = await browser.newContext({
		userAgent:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
	});
	const page = await context.newPage();

	let events: Event[] = [];

	try {
		events = await callBack(page, url);
	} catch (error) {
		console.error("An error occurred while calling back the page:", error);
	}
	await browser.close();
	await page.close();
	await context.close();
	return events;
}  

export { randomDelay };
