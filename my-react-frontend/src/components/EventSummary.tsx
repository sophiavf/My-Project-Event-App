import React, { useEffect, useState } from "react";
import db from "../db";
import {
	collection,
	getCountFromServer,
	query,
	where,
} from "firebase/firestore";
import meetupLogo from "../assets/meetup-logo.png";
import eventbriteLogo from "../assets/eventbrite-logo.png";

async function fetchEventCount(platform: string) {
	const eventsRef = collection(db, "events");
	const platformQuery = query(
		eventsRef,
		where("eventPlatform", "==", platform)
	);
	const snapshot = await getCountFromServer(platformQuery);
	return snapshot.data().count;
}

export default function EventSummary() {
	const [getMeetupCount, setMeetupCount] = useState<number>();
	const [getEventbriteCount, setEventbriteCount] = useState<number>();

	useEffect(() => {
		const fetchEventOverview = async () => {
			const mSnapshot = await fetchEventCount("Meetup");
			setMeetupCount(mSnapshot);
			const eSnapshot = await fetchEventCount("Eventbrite");
			setEventbriteCount(eSnapshot);
		};
		fetchEventOverview();
	}, []);

	return (
		<div className="flex items-center flex-col pt-4 rounded-sm border-accent m-5">
			<div className="grid grid-cols-2 gap-4 w-full max-w-2xl bg-neutral1 p-4 rounded-lg shadow-md justify-items-center">
				<div className="flex items-center">
					<img
						title="meetup logo"
						src={meetupLogo}
						className="h-7 w-auto mr-2"
					/>
					<div>{getMeetupCount || "0"}</div>
				</div>
				<div className="flex items-center">
					<img
						title="eventbrite logo"
						src={eventbriteLogo}
						className="h-4 w-auto mr-2"
					/>
					<div>{getEventbriteCount || "0"}</div>
				</div>
				<div className="col-span-2 text-center">
					<span className="text-xl font-bold">Total Events: </span>
					<span className="text-xl font-semibold">
						{(getMeetupCount || 0) +  (getEventbriteCount || 0)}
					</span>
				</div>
			</div>
		</div>
	);
}
