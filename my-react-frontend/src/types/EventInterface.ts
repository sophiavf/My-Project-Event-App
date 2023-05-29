//https://transform.tools/json-to-typescripthow to parse JSON array into array of custom objects
//https://stackoverflow.com/questions/72954485/react-js-and-typescript-how-to-read-data-from-json
import { Timestamp } from "firebase-admin/firestore";

export default interface Event {
	id: number;
	writeTimestamp: Timestamp;
	eventPlatform: string;
	name: string;
	eventLink: string;
	dateTime: Timestamp;
	location: string;
	summary?: string;
	organizer: string; 
	image: string;
}

