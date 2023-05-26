// // The Firebase Admin SDK to access Firestore.
// import { initializeApp } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";

// initializeApp();
// const db = getFirestore();


// import updateDatabase from "../src/update/index";



// import http = require("http");
// import "jest";

// export const FIRESTORE_EMULATOR_HOST="localhost:8080"


// describe("updateDatabase", () => {
	
// 	afterEach(async () => {
// 		// clears the database between tests https://firebase.google.com/docs/emulator-suite/connect_firestore#node.js-admin-sdk
// 		const options: http.RequestOptions = {
// 			hostname: "localhost",
// 			port: 8080,
// 			path: "/emulator/v1/projects/firestore-emulator-example/databases/(default)/documents",
// 			method: "DELETE",
// 		};

// 		const req = http.request(options, (res) => {
// 			console.log(`statusCode: ${res.statusCode}`);

// 			res.on("data", (d) => {
// 				process.stdout.write(d);
// 			});
// 		});

// 		req.on("error", (error) => {
// 			console.error(error);
// 		});

// 		req.end();
// 	});

// 	// it("adds new events to the database", async () => {
// 	// 	// Run the update function
// 	// 	await updateDatabase(fakeEventData, db);

// 	// 	// Verify that the events were added to the database
// 	// 	const event1 = await db.collection("events").doc("1").get();
// 	// 	expect(event1.exists).toBe(true);

// 	// 	const event2 = await db.collection("events").doc("2").get();
// 	// 	expect(event2.exists).toBe(true);
// 	// });
// });
