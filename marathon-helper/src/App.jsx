import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Pacing from "./Pages/Pacing.jsx";
import Home from "./Pages/Home.jsx";
import Fueling from "./Pages/Fueling.jsx";
export default App;

function App() {
    return (
        <div className="App min-h-screen">
            <nav className="bg-gray-900 p-4 space-x-4 text-lg font-medium sticky top-0 z-10 flex justify-center">
                <Link to="/">Home</Link>
                <Link to="/pacing">Pace Calculator</Link>
                <Link to="/fueling">Fueling Calculator</Link>
            </nav>
            <header className="App-header">
                <h1 className="text-4xl font-bold text-red-600 p-4">
                    Marathon Helper
                </h1>
            </header>
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pacing" element={<Pacing />} />
                    <Route path="/fueling" element={<Fueling />} />
                </Routes>
            </main>
        </div>
    );
}
