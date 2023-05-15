import { useEffect, useState } from "react";
import EventComponent from "./EventComponent";
import Event from "../types/EventInterface";
import React from "react";
import db from "../db";

function EventList() {
	const [getEvents, setEvents] = useState<Array<Event>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		//https://www.freecodecamp.org/news/how-to-consume-rest-apis-in-react/
		const fetchEvents = async () => {
			// try {
			// 	const response = await fetch("/api/events");
			// 	const data: Event[] = await response.json();
			// 	setEvents(data);
			// 	setLoading(false);
			// } catch (error) {
			// 	console.log(error);
			// }

			try {
				const eventsSnapshot = await db.collection("events").get();
				const data: Event[] = [];
				eventsSnapshot.forEach((doc) => {
					data.push(doc.data() as Event);
				});

				setEvents(data);
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		fetchEvents();
	}, []);

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="flex flex-col content-center">
				{loading ? (
					<p>Loading...</p>
				) : (
					getEvents.map((event) => (
						<EventComponent key={event.id} event={event} />
					))
				)}
			</div>
		</div>
	);
}

export default EventList;
