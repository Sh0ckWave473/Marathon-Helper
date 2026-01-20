// import { useState } from "react";
import { useRace } from "../context/useRace.js";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { totalSecondsFromTime } from "../utils/TotalSecondsFromTime.js";
import { secondsToTimeFormat } from "../utils/SecondsToTimeFormat.js";
export default PaceChart;

// Produces a chart of the pace over the marathon distance and what time the runner should be at each mile marker.
function PaceChart() {
    const { goalTime } = useRace();
    const marathonDistance = 26.2; // miles
    const totalSeconds = totalSecondsFromTime(goalTime);

    if (isNaN(totalSeconds) || totalSeconds <= 0) {
        return <div>Please enter a valid goal time to see the pace chart.</div>;
    }
    const paceInSeconds = totalSeconds / marathonDistance;

    const data = [];
    for (let mile = 0; mile <= marathonDistance; mile++) {
        // Potentially add data driven mile paces instead of static pace
        data.push({
            mile: mile.toFixed(1),
            paceInSeconds: paceInSeconds,
        });
    }
    return (
        <LineChart
            width={600}
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mile" />
            <YAxis
                dataKey="paceInSeconds"
                domain={["dataMin - 30", "dataMax + 30"]}
                reversed
                label={{
                    value: "Pace per mile",
                    angle: -90,
                    position: "insideLeft",
                }}
                tickFormatter={(tick) => secondsToTimeFormat(tick)}
            />
            <Tooltip
                formatter={(value) => {
                    return [secondsToTimeFormat(value), "Pace"];
                }}
            />
            <Legend />
            <Line
                dataKey="paceInSeconds"
                name="Pace"
                stroke="#ff3d3d"
                activeDot={{ r: 8 }}
            />
        </LineChart>
    );
}
