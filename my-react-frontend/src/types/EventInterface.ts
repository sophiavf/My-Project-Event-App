//https://transform.tools/json-to-typescripthow to parse JSON array into array of custom objects
//https://stackoverflow.com/questions/72954485/react-js-and-typescript-how-to-read-data-from-json

export default interface EventItem {
	id: number;
	writeTimestamp: Date;
	eventPlatform: string;
	name: string;
	eventLink: string;
	dateTime: string;
	location: string;
	summary?: string;
	image: string;
}

