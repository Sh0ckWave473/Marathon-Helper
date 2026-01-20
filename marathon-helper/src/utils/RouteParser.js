import gpxParser from "gpxparser";

export function RouteParser(gpxText) {
    const parser = new gpxParser();
    parser.parse(gpxText);

    const points = parser.tracks[0].points.map(p => ({
    lat: p.lat,
    lon: p.lon,
    elevation: p.ele, // sometimes present
    distance: p.distance // meters
    }));

    return points;
}