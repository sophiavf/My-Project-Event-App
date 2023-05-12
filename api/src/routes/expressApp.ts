import express, { Application } from "express";
import { createEvent, getEvents } from "../controllers/eventController";
import BodyParser from "body-parser";

import cors from "cors";

const expressApp: Application = express();
expressApp.use(BodyParser.json());
expressApp.use(cors({ origin: true }));

expressApp.post("/events", createEvent);
expressApp.get("/events", getEvents);

export default expressApp;
