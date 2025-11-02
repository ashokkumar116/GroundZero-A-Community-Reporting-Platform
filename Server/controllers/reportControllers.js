const { Reports } = require("../models/Reports");
const { StatusUpdateRequest } = require("../models/StatusUpdateRequest");

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
    const reports = await Reports.find()
        .populate("reportedBy", "-password")
        .populate("assignedTo")
        .populate("comments.author")
        .populate("history.changedBy");
    return res.status(200).json({
        message: "Reports Fetched",
        reports,
    });
};

const UpdateStatusRequest = async (req, res) => {
    try {
        const reportId = req.params.id;
        const { status, note } = req.body;
        const userId = req.user.userId;
        const images = req.files;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const report = await Reports.findById(reportId);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const existingRequest = await StatusUpdateRequest.findOne({
            report: reportId,
            requestedBy: userId,
            requestedStatus: status,
            status: "pending",
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "You already have a pending request for this status.",
            });
        }

        const imageUrls = images.map((image) => ({
            url: image.path,
            publicId: image.filename,
        }));

        const updateRequest = new StatusUpdateRequest({
            report: reportId,
            requestedBy: userId,
            requestedStatus: status,
            note,
            images: imageUrls,
        });
        await updateRequest.save();

        return res.status(201).json({
            message: "Status Update Request Created",
            updateRequest,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    createReport,
    fetchReports,
    UpdateStatusRequest,
};
