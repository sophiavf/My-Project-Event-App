import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	collection,
	doc,
	getDoc,
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
	let page = Number(pageNum);
	const eventsPerPage: number = 20;

	useEffect(() => {
		const fetchEvents = async () => {
			// by default, on load page is set equal to 1 so the page on load is the 1st page
			// Redirect to page 1 if pageNum is not set

			try {
				if (!page) {
					navigate("/page/1");
					page = 1;
				}
				const eventsRef = collection(db, "events");
				// Calculate the total number of pages const totalEvents = await getCountFromServer(eventsRef);
				const totalEvents = await getCountFromServer(eventsRef);
				const totalEventsCount = totalEvents.data().count;
				setTotalPages(Math.ceil(totalEventsCount / eventsPerPage));

				let eventQuery;

				if (page === 1) {
					// For the first page, fetch the first 20 events
					eventQuery = queryF(
						eventsRef,
						orderBy("dateTime"),
						limit(eventsPerPage)
					);
				} else {
					// The ?. operator short-circuits and returns undefined if pageEnds is undefined or null, preventing a TypeError from being thrown
					// For subsequent pages, fetch the pageEnds from paginationSnapshots
					const pageEndDocRef = doc(
						db,
						"paginationSnapshots",
						`page${page - 1}`
					);
					const pageEndsSnapshot = await getDoc(pageEndDocRef);
					// If there are no pageEnds, set isEmpty to true
					if (!pageEndsSnapshot.exists) {
						setIsEmpty(true);
						setLoading(false);
						return;
					}
					const pageEnds = pageEndsSnapshot.data();
					eventQuery = queryF(
						eventsRef,
						orderBy("dateTime"),
						startAfter(pageEnds?.endDocId),
						limit(20)
					);
				}

				const eventsSnapshot = await getDocs(eventQuery);
				const eventsData: Event[] = [];
				eventsSnapshot.forEach((doc) => {
					const eventData: Event = doc.data() as Event;
					eventsData.push(eventData);
				});
				setEvents(eventsData);
				setIsEmpty(eventsData.length === 0);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
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
