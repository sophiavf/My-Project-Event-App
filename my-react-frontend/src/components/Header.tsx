import React from "react";
import { FiCpu } from "react-icons/fi"; //This is an example of a tech icon you can use

const HeaderComponent = () => {
  return (
    <nav className="bg-neutral2 text-neutral1 shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-neutral2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <FiCpu className="block h-8 w-auto" color="complementary" />
            </button>
            <div className="flex-shrink-0 flex items-center ml-2">
              <span className="block lg:hidden h-8 w-auto text-2xl font-bold">Eventbrite & Meetup Aggregator</span> 
              <span className="hidden lg:block h-8 w-auto text-2xl font-bold">Eventbrite & Meetup Aggregator</span> 
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderComponent;
