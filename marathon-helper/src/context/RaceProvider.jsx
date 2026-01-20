import { RaceContext } from "./RaceContext";
import { useLocalStorage } from "../utils/useLocalStorage";

export function RaceProvider({ children }) {
    const [goalTime, setGoalTime] = useLocalStorage("goalTime", {
        hr: "3",
        min: "0",
        sec: "0",
    });

    const [gelsPerHour, setGelsPerHour] = useLocalStorage("gelsPerHour", 2);

    const [paceInSeconds, setPaceInSeconds] = useLocalStorage(
        "paceInSeconds",
        412
    );

    const [usingMiles, setUsingMiles] = useLocalStorage("usingMiles", true);

    return (
        <RaceContext.Provider
            value={{
                goalTime,
                setGoalTime,
                gelsPerHour,
                setGelsPerHour,
                paceInSeconds,
                setPaceInSeconds,
                usingMiles,
                setUsingMiles,
            }}
        >
            {children}
        </RaceContext.Provider>
    );
}
