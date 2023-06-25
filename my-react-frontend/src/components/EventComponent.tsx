import Event from "../types/EventInterface";
import meetupLogo from "../assets/meetup-logo.png";
import eventbriteLogo from "../assets/eventbrite-logo.png";
import React from "react";
import { Timestamp } from "firebase-admin/firestore";
interface EventCardProps {
	event: Event;
}

function formatDate(dateData: Timestamp) {
	const timeDate = dateData.toDate();

	return new Date(timeDate).toLocaleDateString("en-us", {
		weekday: "long",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
}

//https://stackoverflow.com/questions/55075740/property-does-not-exist-on-type-intrinsicattributes
//https://www.typescriptlang.org/docs/handbook/jsx.html#basic-usage
//Components have only one parameter which is the props object
export default function EventComponent({ event }: EventCardProps) {
	return (
		<div className="flex md:flex-row items-center bg-neutral1 rounded m-5 p-5 max-w-3xl justify-between gap-2 flex-col shadow-md">
			<div className="flex flex-col justify-between flex-wrap gap-2 place-self-stretch md:w-2/3">
				<div className="text-lg text-neutral2">{event.name}</div>
				<div className="text-sm font-semibold">{event.organizer}</div>
				<div className="text-secondary text-md font-medium">
					{formatDate(event.dateTime)}
				</div>
				<div className="text-sm">{event.location}</div>
				{event.summary && (
					<p className="text-neutral2 text-xs">{event.summary}</p>
				)}
				<a
					href={event.eventLink}
					target="_blank"
					rel="noopener noreferrer"
					className="underline text-complementary"
				>
					<button
						type="button"
						className="px-4 py-2 mt-2 text-neutral1 bg-primary rounded hover:bg-accent font-semibold"
					>
						Learn more
					</button>
				</a>
			</div>
			<div className="flex flex-col md:w-1/3 gap-2 flex-wrap h-full justify-around">
				<div className="">
					{event.eventPlatform === "Eventbrite" ? (
						<img
							title="eventbrite logo"
							src={eventbriteLogo}
							className="self-center justify-self-center w-full h-6 md:w-full md:h-22 object-contain"
						/>
					) : (
						<img
							title="meetup logo"
							src={meetupLogo}
							className="self-center justify-self-center w-full h-12 md:w-full md:h-22 object-contain"
						/>
					)}
				</div>
				{event.image ? (
					<img
						src={event.image}
						alt="Event"
						className="rounded-lg object-contain min-w-full"
					/>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}
