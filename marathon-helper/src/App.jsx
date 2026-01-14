// import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Pacing from "./Pages/Pacing.jsx";
import Home from "./Pages/Home.jsx";
import Fueling from "./Pages/Fueling.jsx";
export default App;

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={reactLogo} className="App-logo" alt="React logo" />
                <img src={viteLogo} className="App-logo vite" alt="Vite logo" />
                <h1>Marathon Helper</h1>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/pacing">Pace Calculator</Link>
                    <Link to="/fueling">Fueling Calculator</Link>
                </nav>
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
