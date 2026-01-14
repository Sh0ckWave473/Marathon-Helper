import { RaceContext } from "./RaceContext";
import { useLocalStorage } from "../utils/useLocalStorage";

export function RaceProvider({ children }) {
    const [goalTime, setGoalTime] = useLocalStorage("goalTime", {
        hr: "3",
        min: "0",
        sec: "0",
    });

    const [gelsPerHour, setGelsPerHour] = useLocalStorage("gelsPerHour", 2);

    return (
        <RaceContext.Provider
            value={{ goalTime, setGoalTime, gelsPerHour, setGelsPerHour }}
        >
            {children}
        </RaceContext.Provider>
    );
}
