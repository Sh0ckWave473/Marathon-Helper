import { RaceContext } from "./RaceContext";
import { useLocalStorage } from "../utils/useLocalStorage";

export function RaceProvider({ children }) {
    const [goalTimeInSeconds, setGoalTimeInSeconds] = useLocalStorage(
        "goalTime",
        10800,
    );

    const [gelsPerHour, setGelsPerHour] = useLocalStorage("gelsPerHour", 2);

    const [paceInSeconds, setPaceInSeconds] = useLocalStorage(
        "paceInSeconds",
        412,
    );

    const [usingMiles, setUsingMiles] = useLocalStorage("usingMiles", true);

    return (
        <RaceContext.Provider
            value={{
                goalTimeInSeconds,
                setGoalTimeInSeconds,
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
