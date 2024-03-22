import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
	return (
		<div className="bg-red-400">
			<Navbar />
			<Outlet />
			<Footer />
		</div>
	);
};

export default App;
