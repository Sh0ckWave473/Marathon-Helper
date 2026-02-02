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

    const { goalTimeInSeconds, setGoalTimeInSeconds, setPaceInSeconds } =
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
        setGoalTimeInSeconds(totalSeconds);
        console.log("Formatted Time:", secondsToTimeFormat(totalSeconds));
        setError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        calculatePace({ hr: goalTimeHr, min: goalTimeMin, sec: goalTimeSec });
    };

    return (
        <div className="p-4 mb-4">
            <h2 className="text-4xl font-medium mb-4">Pace Calculator</h2>
            <h2 className="text-2xl font-medium">Marathon Pace Calculator</h2>
            <form
                className="m-4 space-x-1 font-medium text-lg"
                onSubmit={handleSubmit}
            >
                <label>Goal Time (HH:MM:SS):</label>
                <label>
                    <select
                        className="m-2 p-1 bg-gray-700 rounded-md hover:bg-gray-600"
                        defaultValue={parseInt(
                            secondsToTimeFormat(goalTimeInSeconds).split(
                                ":",
                            )[0],
                        )}
                        onChange={(e) =>
                            setGoalTimeHr(parseInt(e.target.value))
                        }
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
                        defaultValue={parseInt(
                            secondsToTimeFormat(goalTimeInSeconds).split(
                                ":",
                            )[1],
                        )}
                        onChange={(e) =>
                            setGoalTimeMin(parseInt(e.target.value))
                        }
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
                        defaultValue={parseInt(
                            secondsToTimeFormat(goalTimeInSeconds).split(
                                ":",
                            )[2],
                        )}
                        onChange={(e) =>
                            setGoalTimeSec(parseInt(e.target.value))
                        }
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
        </div>
    );
}
