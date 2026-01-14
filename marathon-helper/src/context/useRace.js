import { useContext } from "react";
import { RaceContext } from "./RaceContext";

export function useRace() {
    return useContext(RaceContext);
}
