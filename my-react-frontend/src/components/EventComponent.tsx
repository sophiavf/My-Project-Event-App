import Event from "../types/EventInterface";
import meetupLogo from "../assets/meetup-logo.png";
import eventbriteLogo from "../assets/eventbrite-logo.png";
import React, { useState } from "react";
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
	const [isExpanded, setIsExpanded] = useState(false);

	const summaryMaxLength = 150;
	const needsReadMore =
		event.summary && event.summary.length > summaryMaxLength;

	return (
		<div className="flex flex-col md:flex-row items-start bg-neutral1 rounded m-5 p-5 max-w-3xl justify-between gap-2 shadow-md">
			<div className="flex flex-col justify-between gap-2 md:w-2/3">
				<div className="text-lg text-neutral2">{event.name}</div>
				<div className="text-sm font-semibold">{event.organizer}</div>
				<div className="text-secondary text-md font-medium">
					{formatDate(event.dateTime)}
				</div>
				<div className="text-sm">{event.location}</div>
				{event.summary && (
					<div className="relative">
						<p
							className={`text-neutral2 text-sm ${
								needsReadMore && !isExpanded ? "line-clamp-3" : ""
							}`}
						>
							{event.summary}
						</p>
						{needsReadMore && (
							<button
								className="text-blue-800 text-sm mt-2 font-semibold hover:text-blue-400"
								onClick={() => setIsExpanded(!isExpanded)}
							>
								{isExpanded ? "Hide text" : "Expand text"}
							</button>
						)}
					</div>
				)}
				<a
					href={event.eventLink}
					target="_blank"
					rel="noopener noreferrer"
					className="underline text-complementary mt-auto"
				>
					<button
						type="button"
						className="px-4 py-2 text-neutral1 bg-primary rounded hover:bg-accent font-semibold"
					>
						Learn More
					</button>
				</a>
			</div>
			<div className="flex flex-col md:w-1/3 gap-2 flex-wrap h-full justify-around">
				<div>
					{event.eventPlatform === "Eventbrite" ? (
						<img
							title="eventbrite logo"
							src={eventbriteLogo}
							className="self-center w-full h-6 md:w-full md:h-22 object-contain"
						/>
					) : (
						<img
							title="meetup logo"
							src={meetupLogo}
							className="self-center w-full h-12 md:w-full md:h-22 object-contain"
						/>
					)}
				</div>
				{event.image ? (
					<img
						src={event.image}
						alt="Event"
						className="rounded-lg object-contain w-full"
					/>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}
