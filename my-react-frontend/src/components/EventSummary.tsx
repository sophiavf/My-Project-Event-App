import React, { useEffect, useState } from "react";
import { getEventPlatformCounts } from "../dbServices";
import meetupLogo from "../assets/meetup-logo.png";
import eventbriteLogo from "../assets/eventbrite-logo.png";

export default function EventSummary() {
	const [getMeetupCount, setMeetupCount] = useState<number>();
	const [getEventbriteCount, setEventbriteCount] = useState<number>();

	useEffect(() => {
		const fetchEventOverview = async () => {
			const [meetup, eventbrite] = await getEventPlatformCounts();
			setMeetupCount(meetup);
			setEventbriteCount(eventbrite);
		};
		fetchEventOverview();
	}, []);

	return (
		<div className="flex items-center flex-col pt-4 rounded-sm border-accent m-3">
			<div className="grid grid-cols-2 gap-4 w-full md:max-w-3xl bg-neutral1 p-5 rounded-lg shadow-md justify-items-center">
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
						{(getMeetupCount || 0) + (getEventbriteCount || 0)}
					</span>
				</div>
			</div>
		</div>
	);
}
