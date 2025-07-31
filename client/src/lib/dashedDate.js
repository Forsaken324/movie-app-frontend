export const dashedDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}