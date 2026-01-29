import { useState } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";
import PaceChart from "../charts/PaceChart";
import RoutePanel from "./RoutePanel.jsx";
import { totalSecondsFromTime } from "../utils/TotalSecondsFromTime";
import { useRace } from "../context/useRace.js";
import { secondsToTimeFormat } from "../utils/SecondsToTimeFormat.js";
export default PaceCalculator;

function PaceCalculator() {
    const [goalTimeHr, setGoalTimeHr] = useLocalStorage("goalTimeHr", "");
    const [goalTimeMin, setGoalTimeMin] = useLocalStorage("goalTimeMin", "");
    const [goalTimeSec, setGoalTimeSec] = useLocalStorage("goalTimeSec", "");

    const { goalTime, setGoalTime, paceInSeconds, setPaceInSeconds } =
        useRace();

    const [error, setError] = useState(null);
    const marathonDistance = 26.2; // miles

    const calculatePace = (time) => {
        const totalSeconds = totalSecondsFromTime(time);
        if (isNaN(totalSeconds) || totalSeconds <= 0) {
            setError("Please enter a valid goal time.");
            return;
        }
        const paceInSeconds = totalSeconds / marathonDistance;
        setPaceInSeconds(paceInSeconds);
        setGoalTime(time);
        setError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        calculatePace({ hr: goalTimeHr, min: goalTimeMin, sec: goalTimeSec });
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-medium">Marathon Pace Calculator</h2>
            <form
                className="m-4 space-x-1 font-medium text-lg"
                onSubmit={handleSubmit}
            >
                <label>Goal Time (HH:MM:SS):</label>
                <label>
                    <select
                        className="m-2 p-1 bg-gray-700 rounded-md hover:bg-gray-600"
                        value={goalTimeHr}
                        defaultValue={goalTime.hours}
                        onChange={(e) => setGoalTimeHr(e.target.value)}
                    >
                        <option value="">--</option>
                        {[...Array(11).keys()].map((hour) => (
                            <option key={hour} value={hour}>
                                {hour}
                            </option>
                        ))}
                    </select>
                </label>
                :
                <label>
                    <select
                        className="m-2 p-1 bg-gray-700 rounded-md hover:bg-gray-600"
                        value={goalTimeMin}
                        defaultValue={goalTime.minutes}
                        onChange={(e) => setGoalTimeMin(e.target.value)}
                    >
                        <option value="">--</option>
                        {[...Array(60).keys()].map((minute) => (
                            <option key={minute} value={minute}>
                                {minute}
                            </option>
                        ))}
                    </select>
                </label>
                :
                <label>
                    <select
                        className="m-2 p-1 bg-gray-700 rounded-md hover:bg-gray-600"
                        value={goalTimeSec}
                        defaultValue={goalTime.seconds}
                        onChange={(e) => setGoalTimeSec(e.target.value)}
                    >
                        <option value="">--</option>
                        {[...Array(60).keys()].map((second) => (
                            <option key={second} value={second}>
                                {second}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <button className="m-4" type="submit">
                    Calculate Pace
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {goalTime ? (
                <div className="mt-8 flex items-center flex-col">
                    <h2 className="text-2xl font-medium">
                        Mile Pace For Each Mile
                    </h2>
                    <p>
                        Your required average pace:{" "}
                        {secondsToTimeFormat(paceInSeconds)}
                    </p>
                    <PaceChart />
                </div>
            ) : (
                <p>Please enter your goal time to see your pace chart.</p>
            )}
            <RoutePanel />
        </div>
    );
}
