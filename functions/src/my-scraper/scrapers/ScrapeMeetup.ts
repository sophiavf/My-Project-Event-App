import { Page, Response } from "playwright-core";
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
	try {
		await page.goto(url);
		// scroll to bottom of page using function above to ensure all available data is loaded
		await scrollToBottom(page);

		const eventData: Event[] = [];
		let response = null;

		page.on("response", async (response: Response) => {
			const responseUrl = response.url();
			const headers = response.headers();
			const status = response.status();
			const contentLength = response.headers()["content-length"];

			if (
				!responseUrl.includes("gql2") &&
				responseUrl.includes("gql") &&
				headers["content-type"]?.includes("application/json") &&
				status === 200 &&
				parseInt(contentLength, 10) > 500
			) {
				const responseData = await response.json();
				response = await { url: responseUrl, data: responseData };
			}
		});

		if (
			response &&
			response?.data &&
			response?.data.rankedEvents
		) {
			response?.data.rankedEvents.forEach((event: any) => {
				const extractedEvent = {
					id: Number(extractID(event.url)),
					writeTimestamp: Timestamp.now(),
					eventPlatform: "Meetup",
					name: event.name || "",
					eventLink: event.url || "",
					dateTime: Timestamp.fromDate(new Date(event.startDate)),
					location:
						`${event.location?.name || ""}, ${
							event.location?.address?.addressLocality || ""
						}, ${event.location?.address?.streetAddress || ""}`.trim() || "",
					summary: String(event?.description) || "",
					organizer: event?.organizer?.name || "",
					image: event?.image || "",
				};
				eventData.push(extractedEvent);
			});
		}

		return eventData;
	} catch (error) {
		console.error(error);
		return [];
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

export { scrapeMeetup, scrollToBottom };
