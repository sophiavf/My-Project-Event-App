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
	const page = await browser.newPage();
	await page.goto(url);

	const events: Event[] = await callBack(page);
	await browser.close();
	return events;
}

export { MIN_DELAY, MAX_DELAY, delay };
