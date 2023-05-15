import React from "react";
import icon from "../assets/shaking-hands.png";
export default function Header() {
	return (
		<header className="bg-primary">
			<div className="flex flex-row items-center justify-start text-neutral1 gap-4 md:pl-40 pl-10 p-3">
				<img src={icon} alt="App icon" className="h-16 " />
				<div className="text-xl text font-bold">Technology Events in Munich</div>
			</div>
		</header>
	);
}
