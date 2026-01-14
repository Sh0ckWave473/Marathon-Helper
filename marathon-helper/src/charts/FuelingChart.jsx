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
import { totalSecondsFromTime } from "../utils/TotalSecondsFromTime";
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
    for (let mile = 0; mile <= marathonDistance; mile++) {
        const timeAtMile = paceInSeconds * mile;
        const hours = Math.floor(timeAtMile / 3600);
        const minutes = Math.floor((timeAtMile % 3600) / 60);
        const seconds = Math.round(timeAtMile % 60);
        const gelsTaken = Math.floor((timeAtMile / 3600) * gelsPerHour).toFixed(
            2
        );
        data.push({
            mile: mile.toFixed(1),
            time: `${hours}h ${minutes}m ${seconds}s`,
            gels: Number(gelsTaken),
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
            <XAxis
                dataKey="mile"
                label={{
                    value: "Mile",
                    position: "insideBottomRight",
                }}
            />
            <YAxis
                label={{
                    value: "Gels Taken",
                    angle: -90,
                    position: "insideLeft",
                }}
            />
            <Tooltip />
            <Legend />
            <Line dataKey="gels" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
    );
}
