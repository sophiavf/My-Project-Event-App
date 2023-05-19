import { Page, Response, chromium } from "playwright";
import { Timestamp } from "firebase-admin/firestore";
import Event from "../../types/Event";
import { randomDelay } from "../index";

// Helper function to convert raw data to Event objects
// The input parameter is an object with an 'events' property
function processEvents(rawData: { events: any[] }): Event[] {
	// Use the 'events' property from the rawData object
	return rawData.events.map((event) => ({
		id: event.id,
		writeTimestamp: Timestamp.now(),
		eventPlatform: "Eventbrite",
		name: event.name,
		eventLink: event.link,
		dateTime: new Date(`${event.start_date} ${event.start_time}`),
		location: event.primary_venue.name,
		summary: event.summary,
		image: event.image.url,
	}));
}

async function goToNextPage(page: Page) {
	const nextPageButton = await page.$("li[data-spec='page-next-wrapper']");
	const classAttribute = await nextPageButton?.getAttribute("class");
	const hasNextPage = !classAttribute?.includes(
		"eds-pagination__navigation-page--is-disabled"
	);
	if (hasNextPage && nextPageButton) {
		await nextPageButton.click();
	}
	return hasNextPage;
}

async function getEvents(page: Page): Promise<Event[]> {
	let events: Event[] = [];
	const responses: { url: string; data: any }[] = [];

	// Start listening to the responses
	page.on("response", async (response: Response) => {
		const url = response.url();
		if (
			url.includes("api/v3/destination/events") ||
			url.includes("api/v3/destination/search")
		) {
			//delay by 6 seconds
			await new Promise((resolve) => setTimeout(resolve, 76000));
			responses.push({ url: url, data: await response.json() });
		}
	});

	// Initial wait
	await page.waitForTimeout(5000);

	let hasNextPage = true;
	while (hasNextPage) {
		// Random delay between requests
		await randomDelay();
		hasNextPage = await goToNextPage(page);
	}

	for (const response of responses) {
		const { url, data } = response;
		if (url.includes("api/v3/destination/events")) {
			events = events.concat(processEvents(data));
		} else if (url.includes("api/v3/destination/search")) {
			events = events.concat(processEvents(data));
		}
	}
	return events;
}

export { getEvents, goToNextPage, processEvents };
