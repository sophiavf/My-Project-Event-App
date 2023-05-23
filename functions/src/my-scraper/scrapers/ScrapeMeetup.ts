import { Page } from "playwright";
import Event from "../../types/Event";

import { randomDelay } from "../index";
import { Timestamp } from "firebase-admin/firestore";

async function scrollToBottom(page: Page) {
	let previousHeight = await page.evaluate(() => document.body.scrollHeight);
	let newHeight;

	while (true) {
		await page.evaluate("window.scrollTo(0, document.body.scrollHeight");
		await page.waitForTimeout(1000);

		newHeight = await page.evaluate(() => document.body.scrollHeight);

		// condition is true if the page can no longer scroll any further
		if (newHeight === previousHeight) {
			break;
		}
		previousHeight = newHeight;
	}
}

// Scrape events
async function scrapeMeetup(page: Page, url: string): Promise<Event[]> {
	// scroll to bottom of page using function above to ensure all available data is loaded

	await scrollToBottom(page);

	// The method runs document.querySelectorAll within the page
	let eventData = await page.$$eval(
		"div[data-testid='categoryResults-eventCard']",
		(events) => {
			return events.map((event) => {
				const id = Number(event.getAttribute("data-eventref"));
				const name = String(event.querySelector("h2")?.textContent || "");
				const eventLink = String(
					event.querySelector("a")?.getAttribute("href")
				);
				const dateTime = String(
					event.querySelector("time")?.getAttribute("datetime")
				);
				const location = String(
					event.querySelector("p.line-clamp-1.md\\:hidden")?.textContent
				);
				const summary = String(
					event.querySelector("p.hidden.md\\:line-clamp-1.text-gray6")
						?.textContent
				);
				const image = String(event.querySelector("img")?.getAttribute("src"));

				return {
					id,
					name,
					eventLink,
					dateTime,
					location,
					summary,
					image,
				};
			});
		}
	);

	eventData = await scrapeEventLocation(page, eventData);

	return eventData.map((event) => ({
		id: event.id,
		writeTimestamp: Timestamp.fromDate(new Date()),
		eventPlatform: "Meetup",
		name: event.name,
		eventLink: event.eventLink,
		dateTime: new Date(event.dateTime),
		location: event.location,
		summary: event.summary,
		image: event.image,
	}));
}

async function scrapeEventLocation(
	page: Page,
	eventData: any[]
): Promise<any[]> {
	for (const event of eventData) {
		if (event.eventLink) {
			await page.goto(event.eventLink);
			const locationSelector = "a[data-testid='venue-name-link']";
			const locationHrefSelector = "a[data-textid='venue-name-link']";
			await page.waitForSelector(".location-display", { timeout: 3000 });
			let location = await page.$eval(locationSelector, (el) =>
				el.textContent?.trim()
			);
			if (!location) {
				const locationHref = await page.$eval(locationHrefSelector, (el) =>
					el?.getAttribute("href")?.trim()
				);
				location = locationHref;
			}

			event.location = location;

			// creates a random delay before the next iteration in the for loop is run
			await randomDelay();
		}
	}
	return eventData;
}

export default scrapeMeetup;
