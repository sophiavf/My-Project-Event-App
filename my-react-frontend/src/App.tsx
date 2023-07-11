import Header from "./components/Header";
import Footer from "./components/Footer";
import EventList from "./components/EventList";
import EventSummary from "./components/EventSummary";
import "./index.css";
import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
	return (
		<Router>
			<div className="App flex flex-col">
				<Header />
				<EventSummary />
				<Routes>
					<Route path="/" element={<EventList />} />
					<Route path="/page/:pageNum" element={<EventList />} />
				</Routes>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
