export const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr)

    return date.toLocaleString("en-US",{
        month:"short",
        day:"2-digit",
        year:"numeric"
    })
};