import { Timestamp } from "firebase-admin/firestore";

interface Event {
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



export default Event