
import { db } from "../../functions/src";
import { expect, test} from '@jest/globals';
import "jest";

const eventsRef = db.collection("events"); 

import runScraper from "../../functions/src/my-scraper";
import cleanupOldEvents from "../../functions/src/cleanup";

import { eventbriteUrl, meetupUrl } from "../../functions/src";

import { scrapeMeetup } from "../../functions/src/my-scraper/scrapers/ScrapeMeetup";
import { scrapeEventbrite } from "../../functions/src/my-scraper/scrapers/ScrapeEventbrite";

test("runScraper with scrapeEventbrite", async () => {
    await runScraper(eventbriteUrl, scrapeEventbrite);
    const q = await eventsRef.where("eventPlatform", "==", "Eventbrite").get();  
    expect(q.empty).toBe(false); 
})
test("runScraper with scrapeMeetup", async () => {
    await runScraper(meetupUrl, scrapeMeetup);
    const q = await eventsRef.where("eventPlatform", "==", "Meetup").get();  
    expect(q.empty).toBe(false); 
})

test("cleanup database", async () => {
    await cleanupOldEvents(db);

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      // Query for events older than 24 hours
    const q = await eventsRef.where("dateTime", "<=", twentyFourHoursAgo).get();     
  
    // Make sure no such events exist
    expect(q.empty).toBe(true);    
})


