import { Page } from "playwright";
import Event from "../../types/Event";

import { MIN_DELAY, MAX_DELAY, delay } from "../index";

export default async function scrapeEventbrite(page: Page): Promise<Event[]> {
	let hasNextPage = true;

	let eventCards: Event[] = [];

	while (hasNextPage) {
		eventCards = await page.$$eval("div.Container_root_5l5cp", (events) => {
			return events.map((event) => {
				const id = Number(event.getAttribute("data-event-id"));
				const name = String(event.querySelector("h2"));
				const writeTimestamp = new Date();
				const eventPlatform = "Eventbrite";
				const eventLink = String(
					event.querySelector("a.event-card-link")?.getAttribute("href")
				);
				const dateTimeText = String(
					event.querySelector("p.Typography_body-md-bold__lp5bn")?.textContent
				);
				const dateTime = new Date(dateTimeText);
				const location = String(
					event.querySelector("p.Typography_body-md__lp5bn")?.textContent
				);
				const summary = "";
				const image = String(
					event.querySelector("img.event-card-image")?.getAttribute("src")
				);

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
			});
		});
		const nextPageButton = await page.$("li[data-spec='page-next-wrapper']");
        const classAttribute = await nextPageButton?.getAttribute("class");
        hasNextPage = !(classAttribute?.includes("eds-pagination__navigation-page--is-disabled"));
	}

	for (const event of eventCards) {
		if (event.eventLink) {
			await page.goto(event.eventLink);
			await delay(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY);

			const summary = await page.$eval(
				"p.summary",
				(el) => el.textContent?.trim() || ""
			);
			event.summary = summary;
		}
	}

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
