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
import { gradeAdjustmentFormula } from "../utils/gradeAdjustmentFormula.js";
export default RoutePanel;

function RoutePanel() {
    const { paceInSeconds, setSplitPacesInSeconds, usingImperial } = useRace();
    const [dataPoints, setDataPoints] = useState([]);
    const [splits, setSplits] = useState([]);
    const [elevationGain, setElevationGain] = useState(0);

    /**
     * Generates a splits array with adjusted pace based on elevation changes and split distance.
     * @param points Array of points with distanceMeters and elevation properties
     * @param splitDistanceMeters distance between splits in meters
     * @returns Array of splits with adjusted pace, distanceMeters, and elevationDelta
     */
    function getSplits(points, splitDistanceMeters) {
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
                // Credit to Aaron Schroeder's implementation of Minetti's formula
                // https://aaron-schroeder.github.io/reverse-engineering/grade-adjusted-pace.html
                let adjustmentFactor =
                    gradeAdjustmentFormula(grade) / gradeAdjustmentFormula(0);
                if (adjustmentFactor > 1)
                    adjustmentFactor = 1 + (adjustmentFactor - 1) * 0.4; // reduce uphill impact
                else adjustmentFactor = 1 - (1 - adjustmentFactor) * 0.4; // reduce downhill impact
                adjustedPace *= adjustmentFactor;
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

    /**
     * Counts the total elevation gain from an array of points. Only positive elevation changes are counted.
     * @param points Array of points with elevation properties
     */
    function getElevationGain(points) {
        let elevationGain = 0;
        for (let i = 1; i < points.length; i++) {
            let elevationDelta = points[i].elevation - points[i - 1].elevation;
            if (elevationDelta > 0) elevationGain += elevationDelta;
        }
        return elevationGain;
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
            let newSplits;
            if (usingImperial) {
                newSplits = getSplits(pointsWithDistanceAndGrade, 1609.34); // 1 mile in meters
            } else {
                newSplits = getSplits(pointsWithDistanceAndGrade, 1000); // 1 km in meters
            }
            setDataPoints(pointsWithDistanceAndGrade);
            setSplits(newSplits);
            setSplitPacesInSeconds(
                newSplits.map((split) => split.adjustedPace),
            );
            setElevationGain(getElevationGain(pointsWithDistanceAndGrade));
            console.log("Mile Splits with Adjusted Pace:", newSplits);
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-4xl font-medium">Route Panel</h2>
            <p>
                Upload a .gpx file of your marathon race course so you can have
                more personalized pacing strategies!
            </p>
            <input
                className="m-4 bg-gray-700 p-2 hover:bg-gray-600 hover:border rounded-md"
                type="file"
                accept=".gpx"
                onChange={handleFileUpload}
            />
            <br />
            <div className="mt-8 flex items-center flex-col">
                {usingImperial ? (
                    <h2 className="text-2xl font-medium">
                        Mile Pace For Each Mile
                    </h2>
                ) : (
                    <h2 className="text-2xl font-medium">
                        Kilometer Pace For Each Kilometer
                    </h2>
                )}
                {splits.length > 0 ? (
                    // Here to visualize splits data
                    <LineChart
                        className="mb-8"
                        width={600}
                        height={300}
                        data={splits}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        {usingImperial ? (
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
                        ) : (
                            <XAxis
                                dataKey="distanceMeters"
                                label={{
                                    value: "Distance (km)",
                                    position: "insideBottomRight",
                                    offset: 0,
                                }}
                                tickFormatter={(tick) => {
                                    return (tick / 1000).toFixed(1);
                                }}
                            />
                        )}
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
                ) : (
                    <LineChart className="mb-8" width={600} height={300}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="distanceMeters" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                    </LineChart>
                )}
                <h2 className="text-2xl font-medium">Elevation Graph:</h2>
                {usingImperial ? (
                    <p>
                        Elevation Gain: {(elevationGain * 3.28084).toFixed(0)}{" "}
                        feet
                    </p>
                ) : (
                    <p>Elevation Gain: {elevationGain.toFixed(0)} meters</p>
                )}
                {dataPoints.length > 0 ? (
                    // Here to visualize elevation data
                    <LineChart
                        className="mb-8"
                        width={600}
                        height={300}
                        data={dataPoints}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        {usingImperial ? (
                            <div>
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
                                        value: "Elevation (feet)",
                                        angle: -90,
                                        position: "insideLeft",
                                    }}
                                    domain={["dataMin - 10", "dataMax + 10"]}
                                    tickFormatter={(tick) => {
                                        return (tick * 3.28084).toFixed(0);
                                    }}
                                />
                                <Tooltip
                                    formatter={(value) => {
                                        return [
                                            (value * 3.28084).toFixed(0) +
                                                " feet",
                                            "Elevation",
                                        ];
                                    }}
                                />
                            </div>
                        ) : (
                            <div>
                                <XAxis
                                    dataKey="distanceMeters"
                                    label={{
                                        value: "Distance (km)",
                                        position: "insideBottomRight",
                                        offset: 0,
                                    }}
                                    tickFormatter={(tick) => {
                                        return (tick / 1000).toFixed(1);
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
                            </div>
                        )}
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
                ) : (
                    <LineChart className="mb-8" width={600} height={300}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="distanceMeters" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                    </LineChart>
                )}
            </div>
        </div>
    );
}
