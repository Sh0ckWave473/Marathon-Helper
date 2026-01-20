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

        const inputCarbsPerHour = Number(
            document.getElementById("carbsPerHour").value,
        );
        const inputCarbsPerGel = Number(
            document.getElementById("carbsPerGel").value,
        );

        if (
            isNaN(inputCarbsPerHour) ||
            isNaN(inputCarbsPerGel) ||
            inputCarbsPerGel <= 0
        ) {
            return;
        }

        setCarbsPerHour(inputCarbsPerHour);
        setCarbsPerGel(inputCarbsPerGel);
        numberGelsPerHour(inputCarbsPerGel);
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit}>
                <label className="block m-1 font-medium text-lg">
                    Desired Carbs per Hour:
                    <input
                        id="carbsPerHour"
                        className="bg-gray-700 p-1 m-1"
                        type="number"
                        defaultValue={carbsPerHour}
                    />
                </label>
                <br />
                <label className="block m-1 font-medium text-lg">
                    Carbs per Gel:
                    <input
                        id="carbsPerGel"
                        className="bg-gray-700 p-1 m-1"
                        type="number"
                        defaultValue={carbsPerGel}
                    />
                </label>
                <br />
                <button type="submit" className="m-1">
                    Calculate Gels per Hour
                </button>
            </form>
            {goalTime && gelsPerHour ? (
                <div>
                    <h2 className="mt-4 font-semibold text-2xl">
                        Estimated Fuel Needs:
                    </h2>
                    <p>
                        Take 1 gel about every {(60 / gelsPerHour).toFixed(0)}{" "}
                        minutes
                    </p>
                    <h2 className="mt-4 font-semibold text-2xl">
                        Fueling Plan for Marathon:
                    </h2>
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
                                gelsPerHour,
                        ) - 1}{" "}
                        gels for the entire race
                    </p>
                    <h2 className="mt-4 text-2xl font-medium">
                        Time To Take Each Gel
                    </h2>
                    <FuelingChart />
                </div>
            ) : (
                <p>Please set a goal time to see the fueling plan.</p>
            )}
        </div>
    );
}
