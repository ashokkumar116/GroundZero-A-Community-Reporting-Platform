const Reports = require("../models/Reports");

const createReport = async (req, res) => {
    const {
        title,
        description,
        category,
        priority,
        village,
        district,
        state,
        pincode,
    } = req.body;
    const images = req.files;
    const userId = req.user.userId;

    const imagesUrls = images.map((image) => ({
        url: image.path,
        publicId: image.filename,
    }));

    if (
        !title ||
        !description ||
        !category ||
        !priority ||
        !village ||
        !district ||
        !state ||
        !pincode
    ) {
        return res.status(400).json({ message: "All Fiels Required" });
    }

    if (images.length === 0) {
        return res.status(400).json({ message: "Please Upload Images" });
    }

    const report = new Reports({
        title,
        description,
        category,
        priority,
        village,
        district,
        state,
        pincode,
        images: imagesUrls,
        reportedBy: userId,
    });

    await report.save();

    return res.status(201).json({
        message: "Report Created",
        report,
    });
};

const fetchReports = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const reports = await Reports.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("reportedBy", "username profile_image")

        const totalReports = await Reports.countDocuments();

        return res.status(200).json({
            message: "Reports Fetched Successfully",
            currentPage: page,
            totalPages: Math.ceil(totalReports / limit),
            totalReports,
            reports,
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const fetchSingleReport = async(req,res)=>{
    const id = req.params.id;
    const userId = req.user.userId;

    const report = await Reports.findById(id)
                                .populate("reportedBy", "-password")
                                .populate("volunteers.volunteer", "-password")
                                .populate("comments.author", "-password")
                                .populate("history.changedBy", "-password");
    if(!report){
        return res.status(404).json({
            message:"Report Not Found"
        })
    }

    if(!report.viewedBy.includes(userId)){
        report.views += 1;
        report.viewedBy.push(userId)
        await report.save();
    }


    return res.status(200).json({
        message:"Report Fetched Successfully",
        report
    })

}

const addComment = async(req,res)=>{
    const id = req.params.id;
    const userId = req.user.userId;
    const {comment} = req.body;
    console.log("BODY:", req.body);

    const report = await Reports.findById(id);

    if(!report){
        return res.status(404).json({
            message:"Report Not Found"
        })
    }

    if(!comment){
        return res.status(400).json({
            message:"Comment is required"
        })
    }
    const newComment = {
        author:userId,
        text:comment
    }

    report.comments.push(newComment);
    await report.save();

    return res.status(201).json({
        message:"Comment Added Successfully",
        comment:newComment
    })
}

const upVote = async(req,res)=>{
    const id = req.params.id;
    const userId = req.user.userId;
    const report = await Reports.findById(id);
    if(!report){
        return res.status(404).json({
            message:"Report Not Found"
        })
    }

    if(report.upvotesBy.includes(userId)){
        report.upvotes -= 1;
        report.upvotesBy.pull(userId);
        await report.save();
        return res.status(200).json({
            message:"Upvote removed Successfully",
            report
        })
    }else{
        report.upvotes += 1;
        report.upvotesBy.push(userId);
        await report.save();
        return res.status(200).json({
            message:"Report Upvoted Successfully",
            report
        })
    }
}

module.exports = {
    createReport,
    fetchReports,
    fetchSingleReport,
    addComment,
    upVote
};
