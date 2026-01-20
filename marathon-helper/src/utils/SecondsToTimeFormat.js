export function secondsToTimeFormat(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);
    let timeString = "";
    if (hrs > 0) {
        timeString += `${hrs}:`;
        if (minutes < 10) {
            timeString += `0${minutes}:`;
        } else {
            timeString += `${minutes}:`;
        }
    }
    else {
        timeString += `${minutes}:`;
    }
    if (secs < 10) {
        timeString += `0${secs}`;
    }
    else {
        timeString += `${secs}`;
    }
    return timeString;
}