import { chromium, Page } from "playwright";

import Event from "../types/Event.js";

const MIN_DELAY = 2; // minimum delay between requests in seconds
const MAX_DELAY = 5; // maximum delay between requests in seconds

function delay(time: number) {
	return new Promise(function (resolve) {
		setTimeout(resolve, time);
	});
}

export default async function runScraper(
	url: string,
	callBack: (page: Page) => Promise<Event[]>
): Promise<Event[]> {
	const browser = await chromium.launch();
	//Prevents the site from blocking requests 
	const context = await browser.newContext({
		userAgent:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64)" +
			" AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
	});
	const page = await context.newPage();
	await page.goto(url);

	const events: Event[] = await callBack(page);
	await browser.close();
	return events;
}

export { MIN_DELAY, MAX_DELAY, delay };
