const Reports = require("../models/Reports");
const { StatusUpdateRequest } = require("../models/StatusUpdateRequest");

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
    UpdateStatusRequest
}