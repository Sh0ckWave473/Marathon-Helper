import { RaceContext } from "./RaceContext";
import { useLocalStorage } from "../utils/useLocalStorage";

export function RaceProvider({ children }) {
    const [goalTimeInSeconds, setGoalTimeInSeconds] = useLocalStorage(
        "goalTime",
        10800,
    );

    const [splitPacesInSeconds, setSplitPacesInSeconds] = useLocalStorage(
        "splitPacesInSeconds",
        [],
    );

    const [gelsPerHour, setGelsPerHour] = useLocalStorage("gelsPerHour", 2);

    const [paceInSeconds, setPaceInSeconds] = useLocalStorage(
        "paceInSeconds",
        412,
    );

    const [usingImperial, setUsingImperial] = useLocalStorage(
        "usingImperial",
        true,
    );

    return (
        <RaceContext.Provider
            value={{
                goalTimeInSeconds,
                setGoalTimeInSeconds,
                splitPacesInSeconds,
                setSplitPacesInSeconds,
                gelsPerHour,
                setGelsPerHour,
                paceInSeconds,
                setPaceInSeconds,
                usingImperial,
                setUsingImperial,
            }}
        >
            {children}
        </RaceContext.Provider>
    );
}
