import express from "express";
import mongoose from "mongoose";
import {IEvent, Event} from './model/Event'
const MONGODB_URI: string = process.env.MONGODB_URI!;

// Connect to your MongoDB Atlas database
mongoose.connect("MONGODB_URI");

// Import your Mongoose schema
const eventSchema = new mongoose.Schema({
	writeTimestamp: { type: Date, default: Date.now },
	eventPlatform: String,
	name: String,
	eventLink: String,
	dateTime: String,
	location: String,
	summary: String,
	image: String,
});


const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Route to get all events
app.get("/events", async (req, res) => {
	try {
		const events = await Event.find();
		res.send(events);
	} catch (err) {
		res.status(500).send(err);
	}
});

// Route to create a new event
app.post("/events", async (req, res) => {
	try {
		const event = new Event(req.body);
		await event.save();
		res.status(201).send(event);
	} catch (err) {
		res.status(500).send(err);
	}
});

export default app;
