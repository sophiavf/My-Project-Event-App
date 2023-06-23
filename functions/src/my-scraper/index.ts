import playwright, { Page } from "playwright-core";
import chromium from "chrome-aws-lambda";

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
	let events: Event[] = [];
	let browser, context;

	try {
		browser = await playwright.chromium.launch({
			args: chromium.args,
			executablePath: await chromium.executablePath,
			headless: chromium.headless,
		});
		context = await browser.newContext();
		const page = await context.newPage();
		events = await callBack(page, url);
	} catch (error) {
		console.error("An error occurred while calling back the page:", error);
	} finally {
		if (browser !== undefined && context !== undefined) {
			await context.close();
			await browser.close();
		}
	}
	return events;
}

export { randomDelay };
