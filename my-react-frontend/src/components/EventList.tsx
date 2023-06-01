import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	collection,
	getDocs,
	query as queryF,
	orderBy,
	startAfter,
	limit,
	getCountFromServer,
} from "firebase/firestore";

import Loading from "./Loading";
import EventComponent from "./EventComponent";
import Event from "../types/EventInterface";
import React from "react";
import db from "../db";

import Pagination from "./Pagination";

function EventList() {
	const [getEvents, setEvents] = useState<Array<Event>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [isEmpty, setIsEmpty] = useState<boolean>(false);
	const [totalPages, setTotalPages] = useState<number>(1);
	const { pageNum } = useParams(); //The useParams hook returns an object of key/value pairs of the dynamic params from the current URL that were matched by the <Route path>. Child routes inherit all params from their parent routes.
	const navigate = useNavigate();
	const page = pageNum ? Number(pageNum) : 1;
	const eventsPerPage: number = 20;

	// Creates state for page ends, which is retrieved depending on which page the user is on so they can navigate back and forth between pages
	const [pageEnds, setPageEnds] = useState<Map<number, any>>(new Map());

	useEffect(() => {
		const fetchEvents = async () => {
			// by default, on load page is set equal to 1 so the page on load is the 1st page
			if (page === 1 && !pageNum) {
				navigate("/page/1");
			}
			try {
				const eventsRef = collection(db, "events");
				const totalEvents = await getCountFromServer(eventsRef);
				const totalEventsCount = totalEvents.data().count;
				setTotalPages(Math.ceil(totalEventsCount / eventsPerPage));

				let q;
				if (page === 1) {
					q = queryF(eventsRef, orderBy("dateTime"), limit(eventsPerPage));
					//if there is a record in the pageEnds state for the previous page, then the last event on that page is used as a reference to fetch events after it for the next. It holds key-value pairs where the keys are of type number (pages) and the values are of any type (any), which returns the las document of a specific page to be used in the cursor pagination for firestore.
				} else if (pageEnds.has(page - 1)) {
					q = queryF(
						eventsRef,
						orderBy("dateTime"),
						startAfter(pageEnds.get(page - 1)),
						limit(eventsPerPage)
					);
				} else {
					return;
				}
				const eventsSnapshot = await getDocs(q);
				if (!eventsSnapshot.empty) {
					const lastVisible =
						eventsSnapshot.docs[eventsSnapshot.docs.length - 1];
					// Saves the last document snapshot in the map
					setPageEnds((prevPageEnds) =>
						new Map(prevPageEnds).set(page, lastVisible)
					);
					const eventsData: Event[] = [];
					eventsSnapshot.forEach((doc) => {
						const eventData: Event = doc.data() as Event;
						eventsData.push(eventData);
					});
					setEvents(eventsData);
				} else {
					setIsEmpty(true);
				}
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		fetchEvents();
		// Scrolls to the top of the page once the page changes 
		window.scrollTo(0, 0);
	}, [page]);

	return (
		<div className="flex flex-col items-center justify-between flex-1">
			<div className="flex flex-col content-center">
				{loading ? (
					<div>
						<Loading />
					</div>
				) : isEmpty ? (
					<p>No events found.</p>
				) : (
					getEvents.map((event) => (
						<EventComponent key={event.id} event={event} />
					))
				)}
			</div>
			{!isEmpty && <Pagination currentPage={page} totalPages={totalPages} />}
		</div>
	);
}

export default EventList;
