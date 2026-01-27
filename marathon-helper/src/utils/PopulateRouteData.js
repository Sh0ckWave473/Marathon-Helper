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

function addGrade(points) {
    return points.map((p, i) => {
        if (i > 0) {
            const elevationDelta = p.elevation - points[i - 1].elevation;
            const distanceDelta =
                p.distanceMeters - points[i - 1].distanceMeters;
            const grade = elevationDelta / distanceDelta;
            return {
                ...p,
                grade,
            };
        }
        return { ...p, grade: 0 };
    });
}

/**
 * Populates the route data with distance and grade information.
 * @param points Array of points with latitude, longitude, and elevation
 * @returns Array of points with added distanceMeters and grade properties
 */
export function populateRouteData(points) {
    const pointsWithDistance = addDistance(points);
    const pointsWithDistanceAndGrade = addGrade(pointsWithDistance);
    return pointsWithDistanceAndGrade;
}
