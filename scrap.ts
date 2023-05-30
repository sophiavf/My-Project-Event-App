import { useEffect, useState } from "react";
import EventComponent from "./EventComponent";
import Event from "../types/EventInterface";
import React from "react";
import db from "../db";
import { collection, getDocs, query, orderBy, startAfter, doc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import Pagination from './Pagination'; // Assume you have this Pagination component

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function EventList() {
	const [getEvents, setEvents] = useState<Array<Event>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [isEmpty, setIsEmpty] = useState<boolean>(true);
    const query = useQuery();
    const page = parseInt(query.get("page")) || 1;
    const eventsPerPage = 10; // Change this to change the number of events per page

    // Helper function to get the starting document for a page
    async function getStartDocument() {
        if (page === 1) return null;
        const q = query(collection(db, "events"), orderBy("dateTime"), startAt(page * eventsPerPage - eventsPerPage), limit(1));
        const startSnapshot = await getDocs(q);
        const [startDoc] = startSnapshot.docs;
        return startDoc;
    }

	useEffect(() => {
		const fetchEvents = async () => {
			try {
                const startDoc = await getStartDocument();
				const eventsRef = collection(db, "events");
				const q = query(eventsRef, orderBy("dateTime"), startAfter(startDoc), limit(eventsPerPage)); 
				const eventsSnapshot = await getDocs(q);
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
	}, [page]);

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
                <Pagination currentPage={page} totalPages={10} /> {/* Replace 10 with actual number of pages */}
			</div>
		</div>
	);
}

export default EventList;
