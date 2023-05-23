import { Page, Response, chromium } from "playwright";
import { Timestamp } from "firebase-admin/firestore";
import Event from "../../types/Event";
// import { randomDelay } from "../index";

// Helper function to convert raw data to Event objects
// The input parameter is an object with an 'events' property
function processEvents(rawData: any[]): Event[] {
	// Use the 'events' property from the rawData object
	return rawData.map((event) => ({
		id: event.id,
		writeTimestamp: Timestamp.now(),
		eventPlatform: "Eventbrite",
		name: event.name,
		eventLink: event.url,
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

async function getEvents(page: Page, url: string): Promise<Event[]> {
	let events: Event[] = [];
	const responses: { url: string; data: any }[] = [];

	page.on("response", async (response: Response) => {
		const url = response.url();
		const headers = response.headers();
		const status = response.status();
		if (!url.includes("log_requests")) {
			if (
				url.includes("api/v3/destination/events/?event_ids") ||
				url.includes("api/v3/destination/search")
			) {
				console.log(`Response status: ${status}`);
				// Check if the content type is application/json and the status is 200
				if (
					headers["content-type"]?.includes("application/json") &&
					status === 200
				) {
					//delay by 7 seconds
					await new Promise((resolve) => setTimeout(resolve, 8000));
					const data = await response.json();
					responses.push({ url: url, data: data });
				}
			}
		}
	});

	await page.goto(url, { waitUntil: "networkidle" });

	let hasNextPage = true;
	while (hasNextPage) {
		hasNextPage = await goToNextPage(page);
	}

	for (const response of responses) {
		const { url, data } = response;

		if (url.includes("api/v3/destination/events/?event_ids")) {
			events = events.concat(processEvents(data.events));
		} else if (url.includes("api/v3/destination/search")) {
			events = events.concat(processEvents(data.events.results));
		}
	}
	return events;
}

export { getEvents, goToNextPage, processEvents };
