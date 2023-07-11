import Event from "../types/EventInterface";
import meetupLogo from "../assets/meetup-logo.png";
import eventbriteLogo from "../assets/eventbrite-logo.png";
import React, { useState } from "react";
import { Timestamp } from "firebase-admin/firestore";
import { marked } from "marked";

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

	function formatSumary() {
		if (event.eventPlatform === "Meetup" && event.summary) {
			return (
				<div dangerouslySetInnerHTML={{ __html: marked(event.summary) }}></div>
			);
		}
	}

	return (
		<div className="flex flex-col md:flex-row bg-neutral1 rounded m-3 p-5 md:max-w-3xl justify-between gap-2 shadow-md w-full">
			<div className="flex flex-col justify-between gap-2 md:w-2/3 max-w-full items-start">
				<div className="text-lg text-neutral2">{event.name}</div>
				<div className="text-sm font-semibold">{event.organizer}</div>
				<div className="text-secondary text-md font-medium">
					{formatDate(event.dateTime)}
				</div>
				<div className="text-sm break-words">
					<span className="font-semibold">Location: </span>
					{event.location}
				</div>
				{event.summary && (
					<div className="relative">
						<p
							className={`text-neutral2 text-sm ${
								needsReadMore && !isExpanded ? "line-clamp-5" : ""
							} break-words overflow-wrap whitespace-break-spaces`}
						>
							{formatSumary()}
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
			<div className="flex flex-col md:w-1/3 gap-2 flex-wrap h-fit ">
				<div>
					{event.eventPlatform === "Eventbrite" ? (
						<img
							title="eventbrite logo"
							src={eventbriteLogo}
							className="self-center w-fit h-6 md:h-22 object-contain mx-auto"
						/>
					) : (
						<img
							title="meetup logo"
							src={meetupLogo}
							className="self-center w-fit h-12 md:h-22 object-contain mx-auto "
						/>
					)}
				</div>
				{event.image ? (
					<img
						src={event.image}
						alt="Event"
						className="rounded-lg w-fit h-auto object-contain mx-auto"
					/>
				) : (
					<></>
				)}
			</div>
		</div>
	);
}
