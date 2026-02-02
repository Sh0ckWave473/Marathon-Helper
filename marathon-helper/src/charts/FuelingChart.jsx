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
export default FuelingChart;

// Produces a chart of the fueling plan over the marathon distance based on gels per hour.
function FuelingChart() {
    const { goalTimeInSeconds, gelsPerHour } = useRace();
    const marathonDistance = 26.2; // miles

    if (
        isNaN(goalTimeInSeconds) ||
        goalTimeInSeconds <= 0 ||
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
    const paceInSeconds = goalTimeInSeconds / marathonDistance;

    const data = [];
    for (
        let gelsTaken = 1;
        gelsTaken <= (goalTimeInSeconds / 3600) * gelsPerHour;
        gelsTaken++
    ) {
        const timeAtGel = (gelsTaken / gelsPerHour) * 3600;
        const mileAtGel = timeAtGel / paceInSeconds;
        data.push({
            mile: mileAtGel.toFixed(1),
            gels: 0,
            time: secondsToTimeFormat(timeAtGel),
        });
    }
    return (
        <div>
            <div>
                <h2 className="mt-4 font-semibold text-2xl">
                    Estimated Fuel Needs:
                </h2>
                <p>
                    Take 1 gel about every {(60 / gelsPerHour).toFixed(0)}{" "}
                    minutes
                </p>
                <h2 className="mt-4 font-semibold text-2xl">
                    Fueling Plan for Marathon:
                </h2>
                <p>
                    For a goal time of {secondsToTimeFormat(goalTimeInSeconds)},
                    you will need approximately{" "}
                    {Math.ceil((goalTimeInSeconds / 3600) * gelsPerHour) - 1}{" "}
                    gels for the entire race
                </p>
            </div>
            {goalTimeInSeconds && gelsPerHour ? (
                <div>
                    <h2 className="mt-4 text-2xl font-medium">
                        Time To Take Each Gel
                    </h2>
                    <LineChart
                        width={600}
                        height={75}
                        data={data}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <XAxis
                            dataKey="time"
                            label={{
                                value: "Time",
                                position: "insideBottomRight",
                                offset: 0,
                            }}
                        />
                        <YAxis dataKey="gels" domain={[0, 0]} />
                        <Legend />
                        <Line
                            dataKey="gels"
                            stroke="#3b82f6"
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </div>
            ) : (
                <LineChart width={600} height={70}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis dataKey="gels" />
                    <Tooltip />
                    <Legend />
                </LineChart>
            )}
        </div>
    );
}
