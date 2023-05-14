interface Event {
	id: number;
	writeTimestamp: Date;
	eventPlatform: string;
	name: string;
	eventLink: string;
	dateTime: Date;
	location: string;
	summary?: string;
	image: string;
}

export default Event