import gpxParser from "gpxparser";

/**
 * Takes in GPX text and returns an array of points with lat, lon, elevation, and distance.
 * @param {string} gpxText GPX data as a string
 * @returns {Array} Array of points with lat, lon, elevation, and distance
 */
export function RouteParser(gpxText) {
    const parser = new gpxParser();
    parser.parse(gpxText);

    const points = parser.tracks[0].points.map((p) => ({
        lat: p.lat,
        lon: p.lon,
        elevation: p.ele, // sometimes present
        distance: p.distance, // meters
    }));

    return points;
}
