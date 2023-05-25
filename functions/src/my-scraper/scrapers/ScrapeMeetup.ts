import { Page } from "playwright";
import Event from "../../types/Event";

import { randomDelay } from "../index";
import { Timestamp } from "firebase-admin/firestore";

async function scrollToBottom(page: Page) {
	let previousHeight = await page.evaluate(() => document.body.scrollHeight);
	let newHeight;

	while (true) {
		await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
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
	page.goto(url, { waitUntil: "networkidle" });
	// scroll to bottom of page using function above to ensure all available data is loaded
	await scrollToBottom(page);

	// The method runs document.querySelectorAll within the page
	const eventData = await page.$$eval(
		"div[data-testid='categoryResults-eventCard']",
		(events) =>
			events.map((event) => ({
				id: Number(event.getAttribute("data-eventref")),
				name: String(event.querySelector("h2")?.textContent || ""),
				eventLink: String(event.querySelector("a")?.getAttribute("href")),
				dateTime: new Date(
					String(event.querySelector("time")?.getAttribute("datetime"))
				),
				organizer: String(
					event
						.querySelector("p.line-clamp-1.md\\:hidden")
						?.textContent?.replace("Group name:", "")
						.trim() || ""
				),
				location: "",
				image: String(event.querySelector("img")?.getAttribute("src")),
			}))
	);

	for (const event of eventData) {
		event.location = await scrapeEventLocation(page, event.eventLink);
		await randomDelay();
	}

	return eventData.map((event) => ({
		id: event.id,
		writeTimestamp: Timestamp.fromDate(new Date()),
		eventPlatform: "Meetup",
		name: event.name,
		eventLink: event.eventLink,
		dateTime: event.dateTime,
		location: event.location,
		organizer: event.organizer,
		image: event.image,
	}));
}

async function scrapeEventLocation(
	page: Page,
	eventLink: string
): Promise<string> {
	if (eventLink) {
		try {
			await page.goto(eventLink, { waitUntil: "networkidle", timeout: 60000 });
		} catch (error) {
			console.error(`Failed to navigate to event link: ${error}`);
			return "";
		}
		let venueName, locationInfo, location;
		try {
			venueName = await page.$eval("a[data-testid='venue-name-link']", (el) =>
				el.textContent?.trim()
			);
			locationInfo = await page.$eval(
				"div[data-testid='location-info']",
				(el) => el.textContent?.trim()
			);
			location = `${venueName}, ${locationInfo}`;
		} catch (error) {
			console.error(`Error fetching venue name and location info: ${error}`);
			location = "";
		}
		return location.trim() || "";
	}
	return "";
}

export { scrapeMeetup, scrapeEventLocation, scrollToBottom };
