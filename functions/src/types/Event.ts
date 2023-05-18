import { Timestamp } from "firebase-admin/firestore";

Timestamp
interface Event {
	id: number;
	writeTimestamp: Timestamp;
	eventPlatform: string;
	name: string;
	eventLink: string;
	dateTime: Date;
	location: string;
	summary?: string;
	image: string;
}



export default Event