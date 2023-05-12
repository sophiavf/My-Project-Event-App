import mongoose from "mongoose";
import request from "supertest";
import { IEvent, Event } from "../src/model/Event";
import expressApp from "../src/routes/expressApp";
import { connectToMongoDB, disconnectFromMongoDB } from "../src/dataBase/db";

describe("GET /events", () => {
	beforeAll(async () => {
		await connectToMongoDB();
	});

	afterAll(async () => {
		await disconnectFromMongoDB();
	});

	it("Should return a list of all events", async () => {
		const eventData: IEvent[] = [
			{
				id: new mongoose.Types.ObjectId(),
				writeTimestamp: new Date(),
				eventPlatform: "Eventbrite",
				name: "GoforeMeets Ethical Design",
				eventLink:
					"https://www.eventbrite.com/e/goforemeets-ethical-design-tickets-605005336247",
				dateTime: "45070 22:00",
				location: "Gofore GmbH (Gofore Munich)",
				summary:
					"We create tomorrow’s digital services and work culture today – we lead digital transformation, as well as design and build innovative solutions. \\nWe’re made up of 1000+ people – top experts in our ind...",
				image:
					"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F482346049%2F1478979932273%2F1%2Foriginal.20230331-142834?w=512&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C4860%2C2430&s=62b08d59e820d08259f215210db82ea8",
			},
			{
				id: new mongoose.Types.ObjectId(),
				writeTimestamp: new Date(),
				eventPlatform: "Eventbrite",
				name: "Toll Global Forwarding Afterwork",
				eventLink:
					"https://www.eventbrite.com/e/toll-global-forwarding-afterwork-tickets-585638639937",
				dateTime: "45055 19:30",
				location: "Messe München",
				summary:
					"David McCrae helps aspiring speakers master virtual communication so that they can find their voice, tell their story and share their message.\\nWhen David lost his dad to cancer at age 22, he realised ...",
				image:
					"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F467612529%2F1011741327583%2F1%2Foriginal.20230313-153421?w=512&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C2160%2C1080&s=b9e0b12797e61f8d33833bda887af3cf",
			},
		];

		// Add the test events to the database
		await Event.insertMany(eventData);

		// Make a GET request to the /events endpoint
		const response = await request(expressApp).get("/events");
		const slicedResponse = response.body.slice(-2);

		//Checks if the response body matches the test

		expect(response.status).toBe(200);
		expect(response.body).toBeInstanceOf(Array);

		for (let index = 0; index < slicedResponse.length; index++) {
			// expect(slicedResponse[index].id.toString()).toBe(eventData[index].id.toString());
			//expect(slicedResponse[index].writeTimestamp).toBeInstanceOf(Date);
			expect(slicedResponse[index].eventPlatform).toBe(eventData[index].eventPlatform);
			expect(slicedResponse[index].name).toBe(eventData[index].name);
			expect(slicedResponse[index].eventLink).toBe(eventData[index].eventLink);
			expect(slicedResponse[index].dateTime).toBe(eventData[index].dateTime);
			expect(slicedResponse[index].location).toBe(eventData[index].location);
			expect(slicedResponse[index].summary).toBe(eventData[index].summary);
			expect(slicedResponse[index].image).toBe(eventData[index].image);
		}
	});
});
