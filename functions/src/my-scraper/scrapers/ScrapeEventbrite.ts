import { ElementHandle, Page } from "playwright";
import Event from "../../types/Event";

import { Timestamp } from "firebase-admin/firestore";

import { MIN_DELAY, MAX_DELAY, delay } from "../index";

export default async function scrapeEventbrite(page: Page): Promise<Event[]> {
	let hasNextPage = true;

	const eventCards: Event[] = [];

	while (hasNextPage) {
		// gets all the event elements containing event card on the page.
		const eventElements = await page.$$("section.event-card-details");
		// Then, for each element, get the event data.
		const eventsOnPagePromise = eventElements.map((eventElement) =>
			getEventData(eventElement, page)
		);
		const eventsOnPage = await Promise.all(eventsOnPagePromise);
		//  uses spread syntax "expands" an array into its elements
		eventCards.push(...eventsOnPage);
	}

	hasNextPage = await goToNextPage(page);

	return eventCards.map((event) => ({
		id: event.id,
		writeTimestamp: event.writeTimestamp,
		eventPlatform: event.eventLink,
		name: event.name,
		eventLink: event.eventLink,
		dateTime: event.dateTime,
		location: event.location,
		summary: event.summary,
		image: event.image,
	}));
}

async function getEventData(
	eventElement: ElementHandle<SVGElement | HTMLElement>,
	page: Page
): Promise<Event> {
	//a helper function which abstracts the logic for querying an element and retrieving its text or attribute
	async function getValue(selector: string, attr?: string) {
		const element = await eventElement.$(selector);
		if (element) {
			return attr
				? await element.getAttribute(attr) 
				: await element.innerText();
		}
		return "";
	}

	const id = Number(await getValue("button[data-event-id]", "data-event-id"));
	const name = (await getValue("h2")) ?? "";
	const writeTimestamp = Timestamp.fromDate(new Date());
	const eventPlatform = "Eventbrite";
	const eventLink = (await getValue("a.event-card-link", "href")) ?? "";
	const dateTimeText = String(
		await getValue("p.Typography_body-md-bold__lp5bn")
	);
	const dateTime = new Date(dateTimeText);
	const location =
		(await getValue("p.Typography_root__lp5bn:nth-child(3)")) ?? "";
	const summary = await getEventSummary(eventLink, page);
	const image = (await getValue("img.event-card-image", "src")) ?? "";

	return {
		id,
		writeTimestamp,
		eventPlatform,
		name,
		eventLink,
		dateTime,
		location,
		summary,
		image,
	};
}
async function getEventSummary(eventLink: string, page: Page) {
	if (eventLink) {
		await page.goto(eventLink);
		await delay(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY);
		const summaryElement = await page.$("p.summary");
		const summary = summaryElement
			? await summaryElement.textContent()
			: "Summary not available";
		await page.goBack();
		return summary?.trim();
	}
}

async function goToNextPage(page: Page) {
	const nextPageButton = await page.$("li[data-spec='page-next-wrapper']");
	const classAttribute = await nextPageButton?.getAttribute("class");
	//if the next page button is disabled, the hasNextPage button is set to false
	const hasNextPage = !classAttribute?.includes(
		"eds-pagination__navigation-page--is-disabled"
	);
	// Click the next button if it exists and is not disabled
	if (hasNextPage && nextPageButton) {
		await nextPageButton.click();
	}

	return hasNextPage;
}

export { getEventData, getEventSummary, goToNextPage };
