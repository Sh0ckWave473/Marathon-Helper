import { useRace } from "../context/useRace.js";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceDot,
} from "recharts";
import { totalSecondsFromTime } from "../utils/TotalSecondsFromTime";
import { secondsToTimeFormat } from "../utils/SecondsToTimeFormat.js";
export default FuelingChart;

// Produces a chart of the fueling plan over the marathon distance based on gels per hour.
function FuelingChart() {
    const { goalTime, gelsPerHour } = useRace();
    const marathonDistance = 26.2; // miles
    const totalSeconds = totalSecondsFromTime(goalTime);

    if (
        isNaN(totalSeconds) ||
        totalSeconds <= 0 ||
        !gelsPerHour ||
        gelsPerHour <= 0
    ) {
        return (
            <div>
                Please enter a valid goal time and gels per hour to see the
                fueling chart.
            </div>
        );
    }
    const paceInSeconds = totalSeconds / marathonDistance;

    const data = [];
    for (let gelsTaken = 0; gelsTaken <= (totalSeconds / 3600) * gelsPerHour; gelsTaken++) {
        const timeAtGel = (gelsTaken / gelsPerHour) * 3600;
        const mileAtGel = timeAtGel / paceInSeconds;
        data.push({ mile: mileAtGel.toFixed(1), gels: gelsTaken, time: secondsToTimeFormat(timeAtGel) });
    }
    return (
        <LineChart
            width={600}
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="time"
                label={{ value: "Time", position: "insideBottomRight" }}
            />
            <YAxis
                dataKey="gels"
                domain={[0, "dataMax + 2"]}
                label={{ value: "Gels Consumed", angle: -90, position: "insideLeft" }}
            />
            <Tooltip formatter={(value) => [value, "Gels"]} />
            <Legend />
            <Line dataKey="gels" stroke="#3b82f6" activeDot={{ r: 8 }} />
        </LineChart>
    );
}
