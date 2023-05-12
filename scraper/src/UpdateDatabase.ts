import axios from "axios";

async function getEvents() {
	const url = "";
	const response = await axios.get(url);
	const events = response.data;
	console.log(events);
}
