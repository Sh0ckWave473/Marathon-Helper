export function totalSecondsFromTime(time) {
    const hours = parseInt(time.hr || 0);
    const minutes = parseInt(time.min || 0);
    const seconds = parseInt(time.sec || 0);
    return hours * 3600 + minutes * 60 + seconds;
}
