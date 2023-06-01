import { Page } from "playwright-core";
import Event from "../../types/Event";

import { randomDelay } from "../index";
import { Timestamp } from "firebase-admin/firestore";

async function scrollToBottom(page: Page) {
	let previousHeight = await page.evaluate(() => document.body.scrollHeight);
	let newHeight;

	while (true) {
		await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");

		newHeight = await page.evaluate(() => document.body.scrollHeight);

		// condition is true if the page can no longer scroll any further
		if (newHeight === previousHeight) {
			break;
		}
		previousHeight = newHeight;
		await randomDelay();
	}
}

// Scrape events
async function scrapeMeetup(page: Page, url: string) {
	await page.goto(url);
	// scroll to bottom of page using function above to ensure all available data is loaded
	await scrollToBottom(page);

	const elements = page.locator("div[data-testid='categoryResults-eventCard']");
	const eventData: Event[] = [];

	for (let i = 0; i < (await elements.count()); i++) {
		const element = elements.nth(i);
		const id = Number(await element.getAttribute("data-eventref"));
		const name = (await element.locator("h2").textContent()) || "";
		const eventLink =
			(await element.locator("a").first().getAttribute("href")) || "";
		const dateTime =
			(await element.locator("time").first().getAttribute("title")) || "";
		let organizer =
			(await element
				.locator("p.line-clamp-1.md\\:hidden")
				.first()
				.textContent()) || "";
		organizer = organizer.replace("Group name:", "").trim();
		const image =
			(await element.locator("img").first().getAttribute("src")) || "";

		eventData.push({
			id,
			writeTimestamp: Timestamp.now(),
			eventPlatform: "Meetup",
			name,
			eventLink,
			dateTime: Timestamp.fromDate(new Date(dateTime)),
			location: "",
			organizer,
			image,
		});
	}

	for (const event of eventData) {
		event.location = await scrapeEventLocation(page, event.eventLink);
		await randomDelay();
	}
	return eventData;
}

async function scrapeEventLocation(
	page: Page,
	eventLink: string
): Promise<string> {
	if (eventLink) {
		try {
			await page.goto(eventLink);
		} catch (error) {
			console.error(`Failed to navigate to event link: ${error}`);
			return "";
		}
		let venueName = "",
			locationInfo = "";			
		try {
			venueName =
				(await page
					.locator("a[data-testid='venue-name-link']")
					.first()
					.textContent()) || "";
		} catch (error) {
			console.error(`Error fetching venue name: ${error}`);
			venueName = "";
		}
		try {
			locationInfo =
				(await page
					.locator("div[data-testid='location-info']")
					.first()
					.textContent()) || "";
		} catch (error) {
			console.error(`Error fetching location info: ${error}`);
			locationInfo = "";
		}

		const location = `${venueName}${
			venueName && locationInfo ? ", " : ""
		}${locationInfo}`.trim();

		// if both venueName and locationInfo are empty, return an empty string
		return venueName || locationInfo ? location.trim() : "";
	}
	return "";
}

export { scrapeMeetup, scrapeEventLocation, scrollToBottom };
