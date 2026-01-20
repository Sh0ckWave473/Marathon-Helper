import { RouteParser } from "../utils/RouteParser.js";
export default RoutePanel;

function RoutePanel() {
    // Haversine formula to calculate distance between two lat/lon points in meters
    // Provided by ChatGPT
    function haversineMeters(p1, p2) {
        const R = 6371000; // Earth radius (meters)
        const toRad = (d) => (d * Math.PI) / 180;

        const dLat = toRad(p2.lat - p1.lat);
        const dLon = toRad(p2.lon - p1.lon);

        const lat1 = toRad(p1.lat);
        const lat2 = toRad(p2.lat);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

        return 2 * R * Math.asin(Math.sqrt(a));
    }

    function addDistance(points) {
        let total = 0;

        return points.map((p, i) => {
            if (i > 0) {
                total += haversineMeters(points[i - 1], p);
            }

            return {
                ...p,
                distanceMeters: total,
            };
        });
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const text = await file.text();
        const points = RouteParser(text);
        const pointsWithDistance = addDistance(points);
        console.log(pointsWithDistance);
    };

    return (
        <div>
            <h2>Route Panel</h2>
            <p>
                Input a .gpx file of your marathon race course so you can have
                more personalized pacing strategies!
            </p>
            <input type="file" accept=".gpx" onChange={handleFileUpload} />
        </div>
    );
}
