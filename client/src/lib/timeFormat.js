export const timeFormat = (minutes, full=false) => {
    const hours = Math.floor(minutes / 60)
    const minutesRemainder = minutes % 60;
    return `${hours > 0 ? `${hours}h` : ''} ${minutesRemainder > 0 ? `${minutesRemainder}m` : ''}`
}