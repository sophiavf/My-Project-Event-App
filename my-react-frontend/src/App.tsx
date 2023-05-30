import Header from "./components/Header";
import Footer from "./components/Footer";
import EventList from "./components/EventList";
import EventSummary from "./components/EventSummary";
import "./index.css";
import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
	return (
		<div className="App flex flex-col h-screen">
			<Header />
			<EventSummary />
			<Router>
				<Routes>
					<Route path="/events" element={<EventList />} />
					<Route path="/events/page/:pageNum" element={<EventList />} />
				</Routes>
			</Router>
			<Footer />
		</div>
	);
}

export default App;
