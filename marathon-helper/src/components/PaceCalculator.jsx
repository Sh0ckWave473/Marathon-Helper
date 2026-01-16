import { useState } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";
import PaceChart from "../charts/PaceChart";
import { totalSecondsFromTime } from "../utils/TotalSecondsFromTime";
import { useRace } from "../context/useRace.js";
export default PaceCalculator;

function PaceCalculator() {
    const [goalTimeHr, setGoalTimeHr] = useLocalStorage("goalTimeHr", "");
    const [goalTimeMin, setGoalTimeMin] = useLocalStorage("goalTimeMin", "");
    const [goalTimeSec, setGoalTimeSec] = useLocalStorage("goalTimeSec", "");

    const { goalTime, setGoalTime, setPaceInSeconds } = useRace();

    const [pace, setPace] = useState(null);
    const [error, setError] = useState(null);
    const marathonDistance = 26.2; // miles

    const calculatePace = (time) => {
        const totalSeconds = totalSecondsFromTime(time);
        if (isNaN(totalSeconds) || totalSeconds <= 0) {
            setError("Please enter a valid goal time.");
            setPace(null);
            return;
        }
        const paceInSeconds = totalSeconds / marathonDistance;
        setPaceInSeconds(paceInSeconds);
        const paceMin = Math.floor(paceInSeconds / 60);
        const paceSec = Math.round(paceInSeconds % 60);
        setPace(`${paceMin}m ${paceSec}s per mile`);
        setGoalTime(time);
        setError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        calculatePace({ hr: goalTimeHr, min: goalTimeMin, sec: goalTimeSec });
    };

    return (
        <div>
            <h2>Marathon Pace Calculator</h2>
            <form onSubmit={handleSubmit}>
                <label>Goal Time:</label>
                <br />
                <label>
                    HH:
                    <select
                        value={goalTimeHr}
                        defaultValue={goalTime.hours}
                        onChange={(e) => setGoalTimeHr(e.target.value)}
                    >
                        <option value="">--</option>
                        {[...Array(7).keys()].map((hour) => (
                            <option key={hour} value={hour}>
                                {hour}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    MM:
                    <select
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
                <label>
                    SS:
                    <select
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
                <button type="submit">Calculate Pace</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {pace ? (
                <div>
                    <p>Your required pace: {pace}</p>
                    <PaceChart />
                </div>
            ) : (
                <p>Please enter your goal time to see your pace chart.</p>
            )}
        </div>
    );
}
