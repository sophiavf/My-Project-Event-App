import { Schema, model, Types } from "mongoose";

// 1. Create an interface representing a document in MongoDB
interface IEvent {
	id: Types.ObjectId;
	writeTimestamp: Date;
	eventPlatform: string;
	name: string;
	eventLink: string;
	dateTime: string; // Could be changed to Date
	location: string;
	summary?: string;
	image: string;
}

// 2. Create a Schema corresponding to the document interface.
const eventSchema = new Schema<IEvent>({
	id: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
	writeTimestamp: { type: Date, required: true },
	eventPlatform: { type: String, required: true },
	name: { type: String, required: true },
	eventLink: { type: String, required: true },
	dateTime: { type: String, required: true },
	location: { type: String, required: true },
	summary: { type: String, required: false },
	image: { type: String, required: true },
});
// 3. Create a Model.
const Event = model<IEvent>("Event", eventSchema);

export  {IEvent, Event};
