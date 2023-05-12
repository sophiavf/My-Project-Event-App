import request from "supertest";
import mongoose from "mongoose";
import expressApp from "../src/routes/expressApp";

import { IEvent } from "../src/model/Event";
import { describe } from "node:test";
import { connectToMongoDB, disconnectFromMongoDB } from "../src/dataBase/db";

describe("POST /events", () => {
	beforeAll(async () => {
		await connectToMongoDB();
	});

	afterAll(async () => {
		await disconnectFromMongoDB();
	});

	it("should return 201 when a new event is added", async () => {
		const eventData: IEvent = {
			id: new mongoose.Types.ObjectId(),
			writeTimestamp: new Date(),
			eventPlatform: "Meetup",
			name: "The Munich Product Conference 2023",
			eventLink:
				"https://www.eventbrite.ie/e/the-munich-product-conference-2023-tickets-597897586777",
			dateTime: "45071 20:00",
			location: "Codecentric",
			summary:
				"Product Network Europe\\n unites Europe's Product Professionals, by making conferences and online communities across the European Continent.",
			image:
				"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F478700109%2F867315957643%2F1%2Foriginal.20230327-171811?w=512&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C2160%2C1080&s=883f0db1a065b17aa055916882acfe9a",
		};

		const response = await request(expressApp).post("/events").send(eventData);
		expect(response.status).toBe(201);
	});
});
