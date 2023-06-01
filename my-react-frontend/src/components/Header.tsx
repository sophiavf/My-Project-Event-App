import React from "react";
import { FiCpu } from "react-icons/fi"; //This is an example of a tech icon you can use

const HeaderComponent = () => {
	return (
		<nav className="flex-1 flex items-center lg:justify-center bg-neutral2 text-neutral1 shadow-lg contain">
				<button className="inline-flex items-center m-2 p-3 rounded-md text-gray-400 hover:text-white hover:bg-neutral2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white contain">
					<FiCpu className="block h-8 w-auto" color="complementary" />
				</button>
				<div className="flex items-center ml-2 contain">
					<span className="block lg:hidden h-auto text-base font-bold ">
						Munich Tech Event Aggregator
					</span>
					<span className="hidden lg:block h-8 w-auto text-2xl font-bold">
						Munich Tech Event Aggregator
					</span>
				</div>
		</nav>
	);
};

export default HeaderComponent;
