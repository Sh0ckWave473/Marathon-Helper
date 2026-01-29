import { useState } from "react";
import { RouteParser } from "../utils/RouteParser.js";
import { useRace } from "../context/useRace.js";
import { populateRouteData } from "../utils/PopulateRouteData.js";
import { secondsToTimeFormat } from "../utils/SecondsToTimeFormat.js";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
export default RoutePanel;

function RoutePanel() {
    const { paceInSeconds } = useRace();
    const [dataPoints, setDataPoints] = useState([]);
    const [splits, setSplits] = useState([]);
    const [hillFactor, setHillFactor] = useState(1);

    /**
     * Generates a splits array with adjusted pace based on elevation changes and split distance.
     * @param points Array of points with distanceMeters and elevation properties
     * @param splitDistanceMeters distance between splits in meters
     * @param hillFactor factor to adjust pace based on desired hill difficulty (default is 1)
     * @returns Array of splits with adjusted pace, distanceMeters, and elevationDelta
     */
    function getSplits(points, splitDistanceMeters, hillFactor = 1) {
        const splits = [];
        let nextSplit = 0;
        let lastPoint = points[0];
        let adjustedPace = paceInSeconds;
        let totalSeconds = 0;
        points.forEach((p) => {
            if (nextSplit === 0) {
                nextSplit += splitDistanceMeters;
                splits.push({
                    distanceMeters: 0,
                    basePace: paceInSeconds,
                    adjustedPace: paceInSeconds,
                    elevationDelta: 0,
                    totalSeconds: 0,
                });
            } else if (p.distanceMeters >= nextSplit) {
                const elevationDelta = p.elevation - lastPoint.elevation;
                const grade =
                    elevationDelta /
                    (p.distanceMeters - lastPoint.distanceMeters);
                // Simple adjustment: increase pace for uphill, decrease for downhill
                if (grade > 0) {
                    adjustedPace *= 1 + grade * 4 * (4 - hillFactor) * (3 / 2); // uphill penalty
                } else {
                    adjustedPace *= 1 + grade * 2 * (4 - hillFactor) * 1; // downhill bonus
                }
                splits.push({
                    distanceMeters: p.distanceMeters,
                    basePace: paceInSeconds,
                    adjustedPace: adjustedPace,
                    elevationDelta: elevationDelta,
                    totalSeconds: (totalSeconds += adjustedPace),
                });
                adjustedPace = paceInSeconds; // reset to base pace for next split
                nextSplit += splitDistanceMeters;
                lastPoint = p;
            }
        });

        return splits;
    }

    const handleFileUpload = async (e) => {
        try {
            const file = e.target.files[0];
            const text = await file.text();
            const points = RouteParser(text);
            const pointsWithDistanceAndGrade = populateRouteData(points);
            console.log(
                "Points with Distance and Grade:",
                pointsWithDistanceAndGrade,
            );
            const newSplits = getSplits(
                pointsWithDistanceAndGrade,
                1609.34,
                hillFactor,
            ); // 1 mile in meters
            setDataPoints(pointsWithDistanceAndGrade);
            setSplits(newSplits);
            console.log("Mile Splits with Adjusted Pace:", newSplits);
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-medium">Route Panel</h2>
            <p>
                Upload a .gpx file of your marathon race course so you can have
                more personalized pacing strategies! Also adjust how hard you
                want to push on the hills.
            </p>
            <input
                className="m-4 bg-gray-700 p-2 hover:bg-gray-600 hover:border rounded-md"
                type="file"
                accept=".gpx"
                onChange={handleFileUpload}
            />
            <br />
            <label className="m-4" htmlFor="hillFactor">
                How hard do you want to push on the hills?
            </label>
            <select
                className="m-4 bg-gray-700 p-2 hover:bg-gray-600 hover:border rounded-md"
                onChange={(e) => setHillFactor(Number(e.target.value))}
                value={hillFactor}
            >
                <option value="1">Easy Hills</option>
                <option value="2">Moderate Hills</option>
                <option value="3">Challenging Hills</option>
            </select>
            {splits.length > 0 && (
                // Here for now to visualize splits data
                <div className="mt-8 flex items-center flex-col">
                    <h2 className="text-2xl font-medium">
                        Pace per Mile based on Race Course:
                    </h2>
                    <LineChart
                        className="mb-8"
                        width={600}
                        height={300}
                        data={splits}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="distanceMeters"
                            label={{
                                value: "Distance (miles)",
                                position: "insideBottomRight",
                                offset: 0,
                            }}
                            tickFormatter={(tick) => {
                                return (tick / 1609.34).toFixed(1);
                            }}
                        />
                        <YAxis
                            label={{
                                value: "Pace",
                                angle: -90,
                                position: "insideLeft",
                            }}
                            domain={["dataMin - 30", "dataMax + 30"]}
                            reversed
                            tickFormatter={(tick) => secondsToTimeFormat(tick)}
                        />
                        <Tooltip
                            formatter={(value) => {
                                return [secondsToTimeFormat(value), "Pace"];
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="adjustedPace"
                            stroke="#4747ff"
                            activeDot={{ stroke: "blue", r: 8 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="basePace"
                            stroke="#ff3c3c"
                            activeDot={{ stroke: "red", r: 8 }}
                        />
                    </LineChart>
                    {/* Here for now to visualize elevation data */}
                    <h2 className="text-2xl font-medium">Elevation Graph:</h2>
                    <LineChart
                        className="mb-8"
                        width={600}
                        height={300}
                        data={dataPoints}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="distanceMeters"
                            label={{
                                value: "Distance (miles)",
                                position: "insideBottomRight",
                                offset: 0,
                            }}
                            tickFormatter={(tick) => {
                                return (tick / 1609.34).toFixed(1);
                            }}
                        />
                        <YAxis
                            label={{
                                value: "Elevation (m)",
                                angle: -90,
                                position: "insideLeft",
                            }}
                            domain={["dataMin - 10", "dataMax + 10"]}
                        />
                        <Tooltip
                            formatter={(value) => {
                                return [value + " m", "Elevation"];
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="elevation"
                            stroke="#82ca9d"
                            dot={false}
                            fill="#8fc5a4"
                            activeDot={{ stroke: "green", r: 8 }}
                        />
                    </LineChart>
                </div>
            )}
        </div>
    );
}
