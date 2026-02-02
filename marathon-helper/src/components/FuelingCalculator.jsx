// import { useState } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";
import { useRace } from "../context/useRace.js";
export default FuelingCalculator;

function FuelingCalculator() {
    const [carbsPerHour, setCarbsPerHour] = useLocalStorage("carbsPerHour", 0);
    const [carbsPerGel, setCarbsPerGel] = useLocalStorage("carbsPerGel", 0);

    const { setGelsPerHour } = useRace();

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
            <h2 className="text-4xl font-medium">Fueling Calculator</h2>
            <form onSubmit={handleSubmit}>
                <label className="block m-1 font-medium text-lg">
                    Desired Carbs per Hour:
                    <input
                        id="carbsPerHour"
                        className="bg-gray-700 p-1 m-1"
                        type="number"
                        defaultValue={carbsPerHour}
                        onChange={(e) =>
                            setCarbsPerHour(Number(e.currentTarget.value))
                        }
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
                        onChange={(e) =>
                            setCarbsPerGel(Number(e.currentTarget.value))
                        }
                    />
                </label>
                <br />
                <button type="submit" className="m-1">
                    Calculate Gels per Hour
                </button>
            </form>
        </div>
    );
}
