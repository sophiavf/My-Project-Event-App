import { scrapeMeetup } from "./scrapers/ScrapeMeetup.ts";
import { scrapeEventbrite } from "./scrapers/ScrapeEventbrite.ts";

async function runScraper() {
	await scrapeMeetup();
	await scrapeEventbrite();
}

runScraper(); 