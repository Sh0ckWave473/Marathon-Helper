/**
 * Converts a number of seconds into a time string formatted as H:MM:SS or MM:SS.
 * @param {number} seconds
 * @returns {string} Time formatted as H:MM:SS or MM:SS
 */
export function secondsToTimeFormat(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    let timeString = "";
    if (hrs > 0) {
        timeString += `${hrs}:`;
        if (minutes < 10) {
            timeString += `0${minutes}:`;
        } else {
            timeString += `${minutes}:`;
        }
    } else {
        timeString += `${minutes}:`;
    }
    if (secs < 10) {
        timeString += `0${secs}`;
    } else {
        timeString += `${secs}`;
    }
    return timeString;
}
