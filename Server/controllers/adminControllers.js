const Announcement = require("../models/Announcement");
const Reports = require("../models/Reports");
const StatusUpdateRequest = require("../models/StatusUpdateRequest");
const User = require("../models/User");
const VolunteerRequest = require("../models/VolunteerRequest");
const { cloudinary } = require("../Services/cloudinary");

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
                                     .select("_id title status priority category village district state pincode description images createdAt reportedBy")
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
            description:report.description,
            pincode:report.pincode,
            village:report.village,
            district:report.district,
            state:report.state,
            category: report.category,
            priority: report.priority,
            status: report.status,
            images:report.images,
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
        .select("_id title status priority category village district state pincode description images createdAt reportedBy")
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
            description:report.description,
            pincode:report.pincode,
            village:report.village,
            district:report.district,
            state:report.state,
            category: report.category,
            priority: report.priority,
            status: report.status,
            images:report.images,
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

const deleteReport = async(req,res)=>{
    try {
        const reportId = req.params.id;
        const report = await Reports.findById(reportId);
        if(!report){
            return res.status(404).json({
                message:"Report Not Found"
            })
        }

        report.images.forEach(image=>{
            cloudinary.uploader.destroy(image.publicId);
        })

        await report.deleteOne();

        return res.status(200).json({
            message:"Report Deleted Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const getVolunteerRequests = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page-1) * limit;
        const requests = await VolunteerRequest.find()
                                               .select("_id report volunteer note requestedAt reviewedBy reviewedAt status")
                                               .populate("report","title")
                                               .populate("volunteer","username profile_image")
                                               .populate("reviewedBy","username profile_image")
                                               .sort({requestedAt:-1})
                                               .skip(skip)
                                               .limit(limit);
        const totalRequests = await VolunteerRequest.countDocuments();

        return res.status(200).json({
            message:"Volunteer Requests Fetched Successfully",
            requests,
            currentPage:page,
            totalRequests,
            totalPages:Math.ceil(totalRequests/limit)
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const getStatusUpdateRequests = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page-1) * limit;
        const requests = await StatusUpdateRequest.find()
                                               .select("_id report requestedBy requestedStatus note images requestedAt reviewedBy reviewedAt status")
                                               .populate("report","title")
                                               .populate("requestedBy","username profile_image")
                                               .populate("reviewedBy","username profile_image")
                                               .sort({requestedAt:-1})
                                               .skip(skip)
                                               .limit(limit);
        const totalRequests = await StatusUpdateRequest.countDocuments();

        return res.status(200).json({
            message:"Status Update Requests Fetched Successfully",
            requests,
            currentPage:page,
            totalRequests,
            totalPages:Math.ceil(totalRequests/limit)
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const getDashboardSummary = async(req,res)=>{
    try {
       const totalUsers = await User.countDocuments();
       const totalReports = await Reports.countDocuments();
       const resolvedReports = await Reports.countDocuments({status:"resolved"});
       const inProgressReports = await Reports.countDocuments({status:"in_progress"});
       const pendingReports = await Reports.countDocuments({status:"reported"});
       const totalVolunteerRequests = await VolunteerRequest.countDocuments();
       const totalStatusUpdateRequests = await StatusUpdateRequest.countDocuments();
       const totalPendingVolunteerRequests = await VolunteerRequest.countDocuments({status:"pending"});
       const totalPendingStatusUpdateRequests = await StatusUpdateRequest.countDocuments({status:"pending"});
       const totalApprovedVolunteerRequests = await VolunteerRequest.countDocuments({status:"approved"});
       const totalApprovedStatusUpdateRequests = await StatusUpdateRequest.countDocuments({status:"approved"});
       const totalRejectedVolunteerRequests = await VolunteerRequest.countDocuments({status:"rejected"});
       const totalRejectedStatusUpdateRequests = await StatusUpdateRequest.countDocuments({status:"rejected"});
       const totalWithdrawnVolunteerRequests = await VolunteerRequest.countDocuments({status:"withdrawn"});

       return res.status(200).json({
           message:"Dashboard Summary Fetched Successfully",
           totalUsers,
           reports:{
               totalReports,
               resolvedReports,
               inProgressReports,
               pendingReports,
           },
           volunteerRequests:{
               totalVolunteerRequests,
               totalPendingVolunteerRequests,
               totalApprovedVolunteerRequests,
               totalRejectedVolunteerRequests,
               totalWithdrawnVolunteerRequests
           },
           statusUpdateRequests:{
               totalStatusUpdateRequests,
               totalPendingStatusUpdateRequests,
               totalApprovedStatusUpdateRequests,
               totalRejectedStatusUpdateRequests,
           },
       })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const getChartsData = async(req,res)=>{
    try {
        const reportsByMonth = await Reports.aggregate([
            {
                $group:{
                    _id:{
                        month:{
                            $month:"$createdAt"
                        },
                        year:{
                            $year:"$createdAt"
                        }
                    },
                    count:{
                        $sum:1
                    }
                }
            },{
                $sort:{
                    "_id.year":1,
                    "_id.month":1
                }
            }
        ])
        const reportsBySeverity = await Reports.aggregate([
            {
                $group:{
                    _id:"$status",
                    count:{
                        $sum:1
                    }
                }
            }
        ])

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const formattedReportsByMonth = reportsByMonth.map((item)=>{
            return {
                month:months[item._id.month-1],
                year:item._id.year,
                count:item.count
            }
        })

        const formatSeverity = {
            "reported":"Pending",
            "in_progress":"In Progress",
            "resolved":"Resolved"
        }

        const formattedReportsBySeverity = reportsBySeverity.map((item)=>{
            return {
                status:formatSeverity[item._id],
                count:item.count
            }
        })

        return res.status(200).json({
            message:"Charts Data Fetched Successfully",
            reportsByMonth:formattedReportsByMonth,
            reportsBySeverity:formattedReportsBySeverity
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const getRecentReports = async(req,res)=>{
    try {
        const recentReports = await Reports.find()
                                           .select("_id title status createdAt reportedBy category")
                                           .populate("reportedBy","username profile_image")
                                           .sort({createdAt:-1})
                                           .limit(5);
        return res.status(200).json({
            message:"Recent Reports Fetched Successfully",
            recentReports
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const createAnnouncement = async(req,res)=>{
    try {
        const {title,description} = req.body;
        const images = req.files;
        if(!title || !description){
            return res.status(400).json({
                message:"Title and Description are required"
            })
        }

        let formattedImages = [];

        if(images){
            formattedImages = images.map((image)=>{
                return {
                    publicId:image.filename,
                    url:image.path
                }
            })
        }

        const announcement = new Announcement({
            title,
            description,
            images:formattedImages,
            postedBy:req.user.userId
        })

        await announcement.save();

        return res.status(201).json({
            message:"Announcement created successfully",
            announcement
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const fetchAnnouncements = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page-1)*limit;
        const announcements = await Announcement.find()
                                                .populate("postedBy","username profile_image")
                                                .populate("viewedBy","username profile_image")
                                                .sort({createdAt:-1})
                                                .limit(limit)
                                                .skip(skip);

        const totalAnnouncements = await Announcement.countDocuments();

        return res.status(200).json({
            message:"Announcements Fetched Successfully",
            announcements,
            currentPage:page,
            totalPages:Math.ceil(totalAnnouncements/limit),
            totalAnnouncements
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const fetchSingleAnnouncement = async(req,res)=>{
    try {
        const {id} = req.params;
        const userId = req.user.userId;
        const announcement = await Announcement.findById(id)
                                            .populate("postedBy","username profile_image")
                                            .populate("viewedBy","username profile_image");
        if(!announcement){
            return res.status(404).json({
                message:"Announcement Not Found"
            })
        }

        const alreadyViewed = announcement.viewedBy.some(v => v._id.toString() === userId.toString());

        if(!alreadyViewed){
            announcement.views += 1;
            announcement.viewedBy.push(userId);
            await announcement.save();
        }

        return res.status(200).json({
            message:"Announcement Fetched Successfully",
            announcement
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

const editAnnouncement = async(req,res)=>{
    try {
        
        const {id} = req.params;
        const announcement = await Announcement.findById(id);
        if(!announcement){
            return res.status(404).json({
                message:"Announcement Not Found"
            })
        }

        const {title,description} = req.body;
        const images = req.files;

        if(!title || !description){
            return res.status(400).json({
                message:"Title and Description are required"
            })
        }

        let formattedImages = [];

        if(images){
            formattedImages = images.map((image)=>{
                return {
                    publicId:image.filename,
                    url:image.path
                }
            })
        }

        announcement.title = title;
        announcement.description = description;
        announcement.images.push(...formattedImages);
        announcement.editedAt = Date.now();
        announcement.editedBy = req.user.userId;
        await announcement.save();

        return res.status(200).json({
            message:"Announcement Updated Successfully",
            announcement
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
    editReport,
    deleteReport,
    getVolunteerRequests,
    getStatusUpdateRequests,
    getDashboardSummary,
    getChartsData,
    getRecentReports,
    createAnnouncement,
    fetchAnnouncements,
    fetchSingleAnnouncement,
    editAnnouncement
};
