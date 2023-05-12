//Express API exposes endpoints to read and create events in the MongoDB database

import { Event, IEvent } from "../model/Event";
import { Request, Response } from "express";

async function createEvent(req: Request, res: Response) {
	try {
		const eventData: IEvent = req.body;
		const newEvent = new Event(eventData);
		await newEvent.save();
		res.status(201).json(newEvent);
	} catch (err) {
		if (err instanceof Error) {
			console.error(`Error creating event: ${err.message}`);
			res.status(500).json({ error: "Internal server error" });
		} else if (typeof err === "string") {
			err.toUpperCase();
		}
	}
}

async function getEvents(req: Request, res: Response) {
	try {
		const events = await Event.find().exec();
		res.status(200).json(events);
	} catch (err) {
		if (err instanceof Error) {
			console.error(`Error creating event: ${err.message}`);
			res.status(500).json({ error: "Internal server error" });
		} else if (typeof err === "string") {
			err.toUpperCase();
		}
	}
}
export { createEvent, getEvents };
