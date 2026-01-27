/**
 * Takes in GPX text and returns an array of points with lat, lon, elevation, and distance.
 * @param {string} gpxText GPX data as a string
 * @returns {Array} Array of points with lat, lon, elevation, and distance
 */
export function RouteParser(gpxText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxText, "application/xml");

    if (xmlDoc.querySelector("parsererror")) {
        throw new Error("Error parsing GPX file.");
    }

    const points = [];

    xmlDoc.querySelectorAll("trkseg").forEach((segment) => {
        segment.querySelectorAll("trkpt").forEach((point) => {
            const lat = parseFloat(point.getAttribute("lat"));
            const lon = parseFloat(point.getAttribute("lon"));
            const eleElem = point.querySelector("ele");
            const elevation = eleElem ? parseFloat(eleElem.textContent) : null;

            points.push({ lat, lon, elevation });
        });
    });

    if (points.length < 10) {
        throw new Error("GPX file contains insufficient data points.");
    }

    return points;
}
