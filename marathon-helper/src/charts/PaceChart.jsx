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
import { secondsToTimeFormat } from "../utils/SecondsToTimeFormat.js";
export default PaceChart;

// Produces a chart of the pace over the marathon distance and what time the runner should be at each mile marker.
function PaceChart() {
    const { goalTimeInSeconds } = useRace();
    const marathonDistance = 26.2; // miles

    if (isNaN(goalTimeInSeconds) || goalTimeInSeconds <= 0) {
        return <div>Please enter a valid goal time to see the pace chart.</div>;
    }
    const paceInSeconds = goalTimeInSeconds / marathonDistance;

    const data = [];
    for (let mile = 0; mile <= marathonDistance; mile++) {
        // Potentially add data driven mile paces instead of static pace
        data.push({
            mile: mile.toFixed(1),
            paceInSeconds: paceInSeconds,
        });
    }
    return (
        <div className="mb-4 flex items-center flex-col">
            <h2 className="text-2xl font-medium">Mile Pace For Each Mile</h2>
            <p>
                Your required average pace: {secondsToTimeFormat(paceInSeconds)}
            </p>
            <LineChart
                width={600}
                height={300}
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="mile"
                    label={{
                        value: "Distance (miles)",
                        position: "insideBottomRight",
                        offset: 0,
                    }}
                />
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
        </div>
    );
}
