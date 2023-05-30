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

import Pagination from "./Pagination"; // Assume you have this Pagination component

function EventList() {
	const [getEvents, setEvents] = useState<Array<Event>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [isEmpty, setIsEmpty] = useState<boolean>(false);
	const [totalPages, setTotalPages] = useState<number>(1);
	const { pageNum } = useParams();
	const navigate = useNavigate();
	const page = pageNum ? Number(pageNum) : 1;
	const eventsPerPage: number = 20;

	// Create state for page ends
	const [pageEnds, setPageEnds] = useState<Map<number, any>>(new Map());

	useEffect(() => {
		const fetchEvents = async () => {
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
					// Save the last document snapshot in the map
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
		// Scroll to the top of the page.
		window.scrollTo(0, 0);
	}, [page, pageNum, navigate, pageEnds]);

	return (
		<div className="flex flex-col items-center justify-center flex-1">
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
