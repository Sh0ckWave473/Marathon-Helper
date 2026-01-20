/**
 * Converts a time object with hr, min, sec properties into total seconds.
 * @param {Object} time - The time object.
 * @param {number} time.hr - Hours.
 * @param {number} time.min - Minutes.
 * @param {number} time.sec - Seconds.
 * @returns {number} Total seconds.
 */
export function totalSecondsFromTime(time) {
    const hours = parseInt(time.hr || 0);
    const minutes = parseInt(time.min || 0);
    const seconds = parseInt(time.sec || 0);
    return hours * 3600 + minutes * 60 + seconds;
}
