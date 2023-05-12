import Header from "./components/Header";
import Footer from "./components/Footer";
import EventList from "./components/EventList";
import "./index.css";

function App() {
	return (
		<div className="App flex flex-col">
			<Header />
			<EventList />
			<Footer />
		</div>
	);
}

export default App;
