import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import EventComponent from "./EventComponent";
import Event from "../types/EventInterface";
import React from "react";
import { getEvents, getTotalEventCount } from "../dbServices";

import Pagination from "./Pagination";

function EventList() {
	const [events, setEvents] = useState<Array<Event>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [isEmpty, setIsEmpty] = useState<boolean>(false);
	const [totalPages, setTotalPages] = useState<number>(1);
	const { pageNum } = useParams(); //The useParams hook returns an object of key/value pairs of the dynamic params from the current URL that were matched by the <Route path>. Child routes inherit all params from their parent routes.
	const navigate = useNavigate();
	let page = Number(pageNum);
	const eventsPerPage: number = 20;

	// Create state for page ends
	const [pageEnds, setPageEnds] = useState<Map<number, any>>(new Map());

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				// by default, on load page is set equal to 1 so the page on load is the 1st page
				// Redirect to page 1 if pageNum is not set
				if (!page) {
					navigate("/page/1");
					page = 1;
				}

				// Calculate the total number of pages const totalEvents = await getCountFromServer(eventsRef);
				const totalEventsCount = await getTotalEventCount();
				setTotalPages(Math.ceil(totalEventsCount / eventsPerPage));
				const eventsSnapshot = await getEvents(page, pageEnds, eventsPerPage);

				if (eventsSnapshot && !eventsSnapshot.empty) {
					const lastVisible =
						eventsSnapshot.docs[eventsSnapshot.docs.length - 1];
					// Saves the last document snapshot in the map
					setPageEnds((prevPageEnds) =>
						new Map(prevPageEnds).set(page, lastVisible)
					);
					const eventsData: Event[] = [];
					eventsSnapshot.forEach((doc: any) => {
						const eventData: Event = doc.data() as Event;
						eventsData.push(eventData);
					});
					setEvents(eventsData);
				} else if ((!eventsSnapshot || eventsSnapshot.empty) && page > 1) {
					navigate("/page/1");
					return;
				} else {
					setIsEmpty(true);
				}
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
		<div className="flex flex-col items-center justify-between flex-1 overflow-x-hidden">
			{loading ? (
				<div>
					<Loading />
				</div>
			) : isEmpty ? (
				<p>No events found.</p>
			) : (
				events.map((event) => <EventComponent key={event.id} event={event} />)
			)}
			{!isEmpty && <Pagination currentPage={page} totalPages={totalPages} />}
		</div>
	);
}

export default EventList;
