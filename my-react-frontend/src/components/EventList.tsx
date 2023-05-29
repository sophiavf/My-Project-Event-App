import { useEffect, useState } from "react";
import EventComponent from "./EventComponent";
import Event from "../types/EventInterface";
import React from "react";
import db from "../db";
import { collection, getDocs } from "firebase/firestore";

function EventList() {
	const [getEvents, setEvents] = useState<Array<Event>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [isEmpty, setIsEmpty] = useState<boolean>(true);
	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const eventsSnapshot = await getDocs(collection(db, "events"));
				const eventsData: Event[] = [];
				eventsSnapshot.forEach((doc) => {
					const eventData: Event = doc.data() as Event;
					eventsData.push(eventData);
				});
				setEvents(eventsData);
				setLoading(false);
				if (getEvents === null) {
					setIsEmpty(false);
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchEvents();
	}, []);

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="flex flex-col content-center">
				{loading || !isEmpty ? (
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
