const User =  require("../models/User");


const isVolunteer = async(req,res,next)=>{
    const userId = req.user.userId;
    const reportId = req.params.id;

    const user = await User.findById(userId).select("volunteer_works");

    const isVolunteering = user.volunteer_works.some(work=>work.report.toString() === reportId);

    if(!isVolunteering){
        return res.status(403).json({message:"Forbidden: Volunteers Only"});
    }
    next();
}

module.exports = isVolunteer;