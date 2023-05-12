import { useEffect, useState } from "react";
import EventComponent from "./EventComponent";
import EventItem from "../types/EventInterface";
import ReactPaginate from "react-paginate";

function EventList() {
	const [getEvents, setEvents] = useState<Array<EventItem>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [perPage] = useState<number>(10);
	const [currentPage, setCurrentPage] = useState<number>(0);

	useEffect(() => {
		//https://www.freecodecamp.org/news/how-to-consume-rest-apis-in-react/
		const fetchEvents = async () => {
			try {
				const response = await fetch("/api/events");
				const data: EventItem[] = await response.json();
				setEvents(data);
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		fetchEvents();
	}, []);

	function handlePageChange(selectedPage: { selected: number }) {
		setCurrentPage(selectedPage.selected);
	}

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="flex flex-col content-center">
				{loading ? (
					<p>Loading...</p>
				) : (
					getEvents
						.slice(currentPage * perPage, (currentPage + 1) * perPage)
						.map((event) => <EventComponent key={event.id} event={event} />)
				)}
			</div>
			<ReactPaginate
				breakLabel="..."
				nextLabel="next "
				pageCount={Math.ceil(getEvents.length / perPage)}
				pageRangeDisplayed={5}
				marginPagesDisplayed={5}
				onPageChange={handlePageChange}
				containerClassName="pagination"
				activeClassName="active"
				renderOnZeroPageCount={null}
			/>
		</div>
	);
}

export default EventList;
