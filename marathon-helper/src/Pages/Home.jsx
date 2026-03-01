export default Home;

import { useRace } from "../context/useRace.js";

function Home() {
    const { usingImperial, setUsingImperial } = useRace();

    return (
        <div>
            <h2>Welcome to the Marathon Helper App!</h2>
            <p>
                Use the navigation links above to access different tools to help
                you prepare for your marathon.
            </p>
            <div className="mt-4">
                <label className="mr-2 font-medium">Units:</label>
                <select
                    className="p-2 bg-gray-700 rounded-md hover:bg-gray-600"
                    value={usingImperial ? "imperial" : "metric"}
                    onChange={(e) =>
                        setUsingImperial(e.target.value === "imperial")
                    }
                >
                    <option value="imperial">Imperial (miles)</option>
                    <option value="metric">Metric (kilometers)</option>
                </select>
            </div>
        </div>
    );
}
