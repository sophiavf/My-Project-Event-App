// import "jest";
// import * as admin from "firebase-admin";
// import * as functions from "firebase-functions-test";
// import {} from "../src/index";

// import Event from "../src/types/Event";

// admin.initializeApp();
// // At the top of test/index.test.js to initialize the SDK
// const testEnv = functions(
// 	{
// 		databaseURL: "https://staging-tech-event-aggregator.firebaseio.com",
// 		storageBucket: "staging-tech-event-aggregator.appspot.com",
// 		projectId: "staging-tech-event-aggregator",
// 	},
// 	"../service-account.json"
// );

// // creates a block that groups together several related tests
// describe("cloud functions", () => {
// 	let wrappedCleanup: any;
// 	let wrappedMeetupScraper: any;
// 	let wrappedEventbriteScraper: any;
// 	beforeAll(() => {
// 		wrappedCleanup = testEnv.wrap(cleanupEvents);
// 		wrappedMeetupScraper = testEnv.wrap(scrapeMeetup);
// 	});
// });
