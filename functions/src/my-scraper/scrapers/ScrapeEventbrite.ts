import { Page, Response } from "playwright";
import { Timestamp } from "firebase-admin/firestore";
import Event from "../../types/Event";

// Helper function to convert raw data to Event objects
// The input parameter is an object with an 'events' property
function processEvents(rawData: any[]): Event[] {
	// Use the 'events' property from the rawData object
	return rawData.map((event) => ({
		id: event?.id,
		writeTimestamp: Timestamp.now(),
		eventPlatform: "Eventbrite",
		name: event?.name,
		eventLink: event?.url,
		dateTime: Timestamp.fromDate(
			new Date(`${event?.start_date} ${event?.start_time}`)
		),
		location: event?.primary_venue?.name,
		summary: event?.summary,
		organizer: event?.primary_organizer?.name,
		image: event?.image?.url,
	}));
}

async function goToNextPage(page: Page) {
	try {
		const nextPageButton = await page.$("li[data-spec='page-next-wrapper']");
		const classAttribute = await nextPageButton?.getAttribute("class");
		const hasNextPage = !classAttribute?.includes(
			"eds-pagination__navigation-page--is-disabled"
		);
		if (hasNextPage && nextPageButton) {
			await nextPageButton.click();
			await new Promise((resolve) => setTimeout(resolve, 8000)); // delay between page navigation, and allows json to load
		}
		return hasNextPage;
	} catch (error) {
		console.error("Error navigating to the next page:", error);
		return false;
	}
}

async function scrapeEventbrite(page: Page, url: string): Promise<Event[]> {
	let events: Event[] = [];
	const responses: { url: string; data: any }[] = [];

	page.on("response", async (response: Response) => {
		const url = response.url();
		const headers = response.headers();
		const status = response.status();

		if (
			!url.includes("log_requests") &&
			(url.includes("api/v3/destination/events/?event_ids") ||
				url.includes("api/v3/destination/search")) &&
			headers["content-type"]?.includes("application/json") &&
			status === 200
		) {
			const data = await response.json();
			responses.push({ url: url, data: data });
		}
	});

	await page.goto(url, { waitUntil: "networkidle" });

	let hasNextPage = true;
	while (hasNextPage) {
		hasNextPage = await goToNextPage(page);
	}
	// Remove the last response before processing because this contains only popular events which the algorithm reccomends and are not tech related 
	responses.pop(); 

	for (const response of responses) {
		const { url, data } = response;

		if (url.includes("api/v3/destination/events/?event_ids")) {
			events = events.concat(processEvents(data.events));
		} else if (url.includes("api/v3/destination/search")) {
			events = events.concat(processEvents(data.events.results));
		}
	}
	// Filter out the events with words in the name which match the case insensitive exclude pattern
	return events;
}

export { scrapeEventbrite, goToNextPage, processEvents };
