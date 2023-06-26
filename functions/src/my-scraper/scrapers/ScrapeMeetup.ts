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
function extractID(url: string) {
	const regex = /(\d+)(?=\/?$)/;
	const match = url.match(regex);
	if (match) {
		return match[1]; // return an empty array in case of error
	} else {
		return;
	}
}

async function extractImageUrl(page: Page, id: number) {
	//targets <img> elements that are descendants of <div> elements matching the ID number
	const imageLocator = page.locator(`div[data-eventref='${id}'] img`);
	const image = await imageLocator.getAttribute("src");
	return image;
}

// Scrape events
async function scrapeMeetup(page: Page, url: string) {
	try {
		await page.goto(url);
		await scrollToBottom(page);

		const elementContent = await page
			.locator("script[type='application/ld+json']")
			.nth(1)
			.textContent();
		let eventJson: any[] | null = null;
		const eventData: Event[] = [];

		if (elementContent !== null) {
			try {
				eventJson = JSON.parse(elementContent);
			} catch (error) {
				console.error("Failed to parse JSON:", error);
			}
		} else {
			console.error("elementContent not found or textContent is null");
		}

		if (eventJson) {
			for (const event of eventJson) {
				const id = Number(extractID(event.url));
				const image = await extractImageUrl(page, id);
				const extractedEvent = {
					id: id,
					writeTimestamp: Timestamp.now(),
					eventPlatform: "Meetup",
					name: event.name || "",
					eventLink: event.url || "",
					dateTime: Timestamp.fromDate(new Date(event.startDate)),
					location: `${event.location?.name || ""}, ${
						event.location?.address?.addressLocality || ""
					}, ${event.location?.address?.streetAddress || ""}`.trim(),
					summary: event.description || "",
					organizer: event.organizer?.name || "",
					image: image || "",
				};
				eventData.push(extractedEvent);
			}
		}

		return eventData;
	} catch (error) {
		console.error(error);
		return []; // return an empty array in case of error
	}
}

export { scrapeMeetup, scrollToBottom };
