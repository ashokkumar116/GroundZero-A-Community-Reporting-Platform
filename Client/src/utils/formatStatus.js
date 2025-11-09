export const formatStatus = (status)=>{
    if(!status) return;
    return status.split('_').join(" ");
}