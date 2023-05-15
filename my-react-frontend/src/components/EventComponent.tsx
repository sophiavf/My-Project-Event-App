import Event from "../types/EventInterface";
import meetupLogo from "../assets/meetup-logo.png";
import eventbriteLogo from "../assets/eventbrite-logo.png";
import React from "react";

interface EventCardProps {
	event: Event;
}

//function formatDate(dateData: Date) {}

//https://stackoverflow.com/questions/55075740/property-does-not-exist-on-type-intrinsicattributes
//https://www.typescriptlang.org/docs/handbook/jsx.html#basic-usage
//Components have only one parameter which is the props object
export default function EventComponent({ event }: EventCardProps) {
	return (
		<div className="flex md:flex-row items-center bg-neutral1 rounded m-5 p-5 max-w-2xl justify-between gap-4 flex-col">
			<div className="flex flex-col justify-between flex-wrap gap-2 place-self-stretch md:w-2/3">
				<div className="text-lg text-neutral2">{event.name}</div>
				<div className="text-secondary text-sm">
					{event.dateTime}, {event.location}
				</div>
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
			<div className="flex md:flex-col mt-4 content-between place-self-stretch gap-5 flex-row justify-center place-items-center md:w-1/3">
				{event.eventPlatform === "Eventbrite" ? (
					<img
						title="eventbrite logo"
						src={eventbriteLogo}
						className="self-center flex justify-center w-1/2 md:w-auto"
					/>
				) : (
					<img
						title="meetup logo"
						src={meetupLogo}
						className="self-center flex justify-center w-1/2 md:w-auto"
					/>
				)}
				<img
					src={event.image}
					alt="Event"
					className=" rounded-lg w-1/2 md:w-auto"
				/>
			</div>
		</div>
	);
}
