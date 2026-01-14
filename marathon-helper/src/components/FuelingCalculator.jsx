// import { useState } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";
import { useRace } from "../context/useRace.js";
import { totalSecondsFromTime } from "../utils/TotalSecondsFromTime";
import FuelingChart from "../charts/FuelingChart";
export default FuelingCalculator;

function FuelingCalculator() {
    const [carbsPerHour, setCarbsPerHour] = useLocalStorage("carbsPerHour", 0);
    const [carbsPerGel, setCarbsPerGel] = useLocalStorage("carbsPerGel", 0);

    const { goalTime, gelsPerHour, setGelsPerHour } = useRace();

    const numberGelsPerHour = (carbsPerGel) => {
        setGelsPerHour(carbsPerHour / carbsPerGel);
        return carbsPerHour / carbsPerGel;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        numberGelsPerHour(carbsPerGel);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Desired Carbs per Hour:
                    <input
                        type="number"
                        value={carbsPerHour}
                        onChange={(e) =>
                            setCarbsPerHour(Number(e.target.value))
                        }
                    />
                </label>
                <br />
                <label>
                    Carbs per Gel:
                    <input
                        type="number"
                        value={carbsPerGel}
                        onChange={(e) => setCarbsPerGel(Number(e.target.value))}
                    />
                </label>
                <br />
                <button type="submit">Calculate Gels per Hour</button>
            </form>
            <h3>Estimated Fuel Needs:</h3>
            <p>
                Take 1 gel about every {(60 / gelsPerHour).toFixed(0)} minutes
            </p>
            <h3>Fueling Plan for Marathon:</h3>
            {goalTime && gelsPerHour ? (
                <div>
                    <p>
                        For a goal time of {goalTime.hr}h {goalTime.min}m{" "}
                        {goalTime.sec}s, you will need approximately{" "}
                        {(
                            (totalSecondsFromTime(goalTime) / 3600) *
                            carbsPerHour
                        ).toFixed(0)}{" "}
                        grams of carbohydrates.
                    </p>
                    <p>
                        This equates to about{" "}
                        {Math.ceil(
                            (totalSecondsFromTime(goalTime) / 3600) *
                                gelsPerHour
                        ) - 1}{" "}
                        gels for the entire race
                    </p>
                    <FuelingChart />
                </div>
            ) : (
                <p>Please set a goal time to see the fueling plan.</p>
            )}
        </div>
    );
}
