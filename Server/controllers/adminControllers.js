const Reports = require("../models/Reports");
const StatusUpdateRequest = require("../models/StatusUpdateRequest");
const User = require("../models/User");
const VolunteerRequest = require("../models/VolunteerRequest");

const reviewVolunteerRequest = async (req, res) => {
    const { status } = req.body;
    const adminId = req.user.userId;
    const requestId = req.params.id;

    const request = await VolunteerRequest.findById(requestId);

    if (!request) {
        return res.status(400).json({
            message: "Request Not Found",
        });
    }

    if (request.status !== "pending") {
        return res.status(400).json({
            message: "Request has been already Reviewed",
        });
    }

    if (status === "approved") {
        request.status = "approved";
        request.reviewedBy = adminId;
        request.reviewedAt = Date.now();

        await Promise.all([
            User.findByIdAndUpdate(request.volunteer, {
                $addToSet: {
                    volunteer_works: {
                        report: request.report,
                        joinedAt: Date.now(),
                    },
                },
            }),
            Reports.findByIdAndUpdate(request.report, {
                $addToSet: {
                    volunteers: {
                        volunteer: request.volunteer,
                        joinedAt: Date.now(),
                    },
                },
            }),
        ]);
    } else if (status === "rejected") {
        request.status = "rejected";
        request.reviewedBy = adminId;
        request.reviewedAt = Date.now();
    } else {
        return res.status(400).json({
            message: "Invalid Action",
        });
    }

    await request.save();

    return res.status(200).json({
        message: `Request has been ${status} Successfully`,
        request,
    });
};

const reviewStatusUpdateRequest = async (req, res) => {
    try {
        const { status } = req.body || {};
        const requestId = req.params.id;
        const adminId = req.user.userId;

        if (!status) {
            return res.status(400).json({
                message: "Status is required",
            });
        }

        const request = await StatusUpdateRequest.findById(requestId);

        if (!request) {
            return res.status(400).json({
                message: "Request Not Found",
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                message: "Request has been reviewed already",
            });
        }

        const report = await Reports.findById(request.report);

        if(!report){
            return res.status(400).json({
                message:"Report Not Found"
            })
        }

        if (status === "approved") {
            request.status = "approved";
            request.reviewedBy = adminId;
            request.reviewedAt = Date.now();

            await Reports.findByIdAndUpdate(request.report, {
                $set: {
                    status: request.requestedStatus,
                    updatedAt:Date.now()
                },
                $push:{
                    history:{
                        from:report.status,
                        to:request.requestedStatus,
                        changedBy:request.requestedBy,
                        note:request.note,
                        images:request.images,
                        at:Date.now()
                    }
                }
            });
        } else if (status === "rejected") {
            request.status = "rejected";
            request.reviewedBy = adminId;
            request.reviewedAt = Date.now();
        } else {
            return res.status(400).json({
                message: "Invalid Action",
            });
        }

        await request.save();

        return res.status(200).json({
            message: `Request has been ${status} Successfully`,
            request,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
        });
    }
};

const getUsers = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const users = await User.aggregate([
            {
                $lookup:{
                    from:"reports",
                    localField:"_id",
                    foreignField:"reportedBy",
                    as:"reports"
                }
            },{
                $lookup:{
                    from:"reports",
                    localField:"_id",
                    foreignField:"volunteers.volunteer",
                    as:"volunteeredReports"
                }
            },
            {
                $project:{
                    _id:1,
                    username:1,
                    bio:1,
                    email:1,
                    profile_image:1,
                    isAdmin:1,
                    phone:1,
                    dob:1,
                    village_name:1,
                    district:1,
                    state:1,
                    pincode:1,
                    createdAt:1,
                    postCount:{$size:"$reports"},
                    volunteeredCount:{$size:"$volunteeredReports"}
                }
            },{
                $sort:{
                    createdAt:-1
                }
            },{
                $skip:skip
            },{
                $limit:limit
            }
        ])

        const total = await User.countDocuments();

        const formattedUsers = users.map(u => ({
            user: {
                _id: u._id,
                username: u.username,
                email: u.email,
                profile_image: u.profile_image,
            },
            username:u.username,
            bio:u.bio,
            phone:u.phone,
            dob:u.dob,
            village_name:u.village_name,
            district:u.district,
            state:u.state,
            pincode:u.pincode,
            isAdmin: u.isAdmin,
            joined: u.createdAt,
            postCount: u.postCount,
            volunteeredCount: u.volunteeredCount,

        }));
        
        return res.status(200).json({
            message:"Users Fetched Successfully",
            users:formattedUsers,
            currentPage:page,
            totalUsers:total,
            totalPages:Math.ceil(total/limit)
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const editUser = async(req,res)=>{
    try {
        const userId = req.params.id;

        const {username,bio,phone,dob,village_name,district,state,pincode} = req.body;

        const user = await User.findById(userId).select("-password");

        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.phone = phone || user.phone;
        if(dob){
            user.dob = dob;
        }
        user.village_name = village_name || user.village_name
        user.district = district || user.district
        user.state = state || user.state
        user.pincode = pincode || user.pincode

        await user.save();

        return res.status(200).json({
            message:"Profile Updated Successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const makeAdmin = async(req,res)=>{
    try {
        
        const userId = req.params.id;

        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(400).json({
                message:"User Not Found"
            })
        }

        if(user.isAdmin){
            return res.status(400).json({
                message:"User is already an Admin"
            })
        }

        user.isAdmin = true;

        await user.save();

        return res.status(200).json({
            message:"User Promoted to Admin Successfully",
            user
        })

    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const removeAdmin = async(req,res)=>{
    try {
        
        const userId = req.params.id;

        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(400).json({
                message:"User Not Found"
            })
        }

        if(!user.isAdmin){
            return res.status(400).json({
                message:"User is not an Admin"
            })
        }

        user.isAdmin = false;

        await user.save();

        return res.status(200).json({
            message:"User Demoted to User Successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const searchUsers = async(req,res)=>{
    try {
        const search = req.query.search;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const users = await User.aggregate([
            {
                $lookup:{
                    from:"reports",
                    localField:"_id",
                    foreignField:"reportedBy",
                    as:"reports"
                }
            },
            {
                $lookup:{
                    from:"reports",
                    localField:"_id",
                    foreignField:"volunteers.volunteer",
                    as:"volunteeredReports"
                }
            },
            {
                $project:{
                    _id:1,
                    username:1,
                    email:1,
                    profile_image:1,
                    isAdmin:1,
                    createdAt:1,
                    postCount:{$size:"$reports"},
                    volunteeredCount:{$size:"$volunteeredReports"},
                    bio:1,
                    phone:1,
                    dob:1,
                    village_name:1,
                    district:1,
                    state:1,
                    pincode:1
                }
            },
            {
                $sort:{
                    createdAt:-1
                }
            },
            {
                $match:{
                    $or:[
                        {username:{$regex:search,$options:"i"}},
                        {email:{$regex:search,$options:"i"}}
                    ]
                }
            },
            {
                $skip:skip
            },
            {
                $limit:limit
            }
        ])

        const formattedUsers = users.map(u => ({
            user: {
                _id: u._id,
                username: u.username,
                email: u.email,
                profile_image: u.profile_image,
            },
            username:u.username,
            bio:u.bio,
            phone:u.phone,
            dob:u.dob,
            village_name:u.village_name,
            district:u.district,
            state:u.state,
            pincode:u.pincode,
            isAdmin: u.isAdmin,
            joined: u.createdAt,
            postCount: u.postCount,
            volunteeredCount: u.volunteeredCount
        }));

        const total = await User.countDocuments({
            $or:[
                {username:{$regex:search,$options:"i"}},
                {email:{$regex:search,$options:"i"}}
            ]
        });

        return res.status(200).json({
            message:"Users Searched Successfully",
            users:formattedUsers,
            currentPage:page,
            totalUsers:total,
            totalPages:Math.ceil(total/limit)
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const getReports = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const reports = await Reports.find({})
                                     .select("_id title status priority category village district state pincode createdAt reportedBy")
                                     .populate("reportedBy","username profile_image")
                                     .sort({createdAt:-1})
                                     .skip(skip)
                                     .limit(limit);

        const total = await Reports.countDocuments();

        const formattedReports = reports.map(report => ({
            _id: report._id,
            title: {
                title: report.title,
                location: {
                    village: report.village,
                    district: report.district,
                    state: report.state,
                    pincode: report.pincode
                }
            },
            category: report.category,
            priority: report.priority,
            status: report.status,
            reportedAt: report.createdAt,
            reportedBy: {
                _id: report.reportedBy._id,
                username: report.reportedBy.username,
                profile_image: report.reportedBy.profile_image
            }
        }));

        return res.status(200).json({
            message:"Reports Fetched Successfully",
            reports:formattedReports,
            currentPage:page,
            totalReports:total,
            totalPages:Math.ceil(total/limit)
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const searchReports = async(req,res)=>{
    try {
        const search = req.query.search;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page-1) * limit;

        const reports = await Reports.find({
            $or:[
                {title:{$regex:search,$options:"i"}},
                {description:{$regex:search,$options:"i"}},
                {category:{$regex:search,$options:"i"}},
                {priority:{$regex:search,$options:"i"}},
                {village:{$regex:search,$options:"i"}},
                {district:{$regex:search,$options:"i"}},
                {state:{$regex:search,$options:"i"}}
            ]
        })
        .select("_id title status priority category village district state pincode createdAt reportedBy")
        .populate("reportedBy","username profile_image")
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);

        const totalReports = await Reports.countDocuments({
            $or:[
                {title:{$regex:search,$options:"i"}},
                {description:{$regex:search,$options:"i"}},
                {category:{$regex:search,$options:"i"}},
                {priority:{$regex:search,$options:"i"}},
                {village:{$regex:search,$options:"i"}},
                {district:{$regex:search,$options:"i"}},
                {state:{$regex:search,$options:"i"}}
            ]
        })

        const formattedReports = reports.map(report => ({
            _id: report._id,
            title: {
                title: report.title,
                location: {
                    village: report.village,
                    district: report.district,
                    state: report.state,
                    pincode: report.pincode
                }
            },
            category: report.category,
            priority: report.priority,
            status: report.status,
            reportedAt: report.createdAt,
            reportedBy: {
                _id: report.reportedBy._id,
                username: report.reportedBy.username,
                profile_image: report.reportedBy.profile_image
            }
        }))

        return res.status(200).json({
            message:"Reports Searched Successfully",
            reports:formattedReports,
            currentPage:page,
            totalReports:totalReports,
            totalPages:Math.ceil(totalReports/limit)
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const editReport = async(req,res)=>{
    try {
        const reportId = req.params.id;
        const {title,description,category,priority,village,district,state,pincode} = req.body;
        const images = req.files;
        const report = await Reports.findById(reportId);

        if(!report){
            return res.status(404).json({
                message:"Report Not Found"
            })
        }

        report.title = title;
        report.description = description;
        report.category = category;
        report.priority = priority;
        report.village = village;
        report.district = district;
        report.state = state;
        report.pincode = pincode;
        report.updatedAt = Date.now();
        if(images){
            const links = images.map(image=>{
                return(
                    {
                        url:image.path,
                        publicId:image.filename
                    }
                )
            })
            report.images = [...report.images,...links];
        }
        await report.save();
        return res.status(200).json({
            message:"Report Updated Successfully",
            report
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

module.exports = {
    reviewVolunteerRequest,
    reviewStatusUpdateRequest,
    getUsers,
    editUser,
    makeAdmin,
    removeAdmin,
    searchUsers,
    getReports,
    searchReports,
    editReport
};
