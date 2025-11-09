export const formatDateTime = (dateTime)=>{
    if(!dateTime) return;
    const date = new Date(dateTime)
    return date.toLocaleString("en-US",{
        month:"short",
        day:"2-digit",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit",
        hour12:true
    })
}