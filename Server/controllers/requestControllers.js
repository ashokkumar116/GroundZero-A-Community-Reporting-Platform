const Reports = require("../models/Reports");
const StatusUpdateRequest = require("../models/StatusUpdateRequest");
const VolunteerRequest = require("../models/VolunteerRequest");

const UpdateStatusRequest = async (req, res) => {
    try {
        const reportId = req.params.id;
        const { status, note } = req.body  || {};
        const userId = req.user.userId;
        const images = req.files;


        if (!status || !note  || !images) {
            return res.status(400).json({ message: "All Fields are required" });
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

const volunteerRequest = async (req, res) => {
    try {
        const { note } = req.body || {};
        const userId = req.user.userId;
        const reportId = req.params.id;

        if (!note) {
            return res.status(400).json({ message: "Note is required" });
        }

        const report = await Reports.findById(reportId);

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const isAlreadyRequested = await VolunteerRequest.findOne({
            report: reportId,
            volunteer: userId,
        });

        if (isAlreadyRequested) {
            return res.status(400).json({
                message:
                    "You have already requested to volunteer for this report",
            });
        }

        const request = new VolunteerRequest({
            report: reportId,
            volunteer: userId,
            note,
        });

        await request.save();

        return res.status(201).json({
            message: "Volunteer Request Created",
            request,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });
    }
};

const withdrawVolunteerRequest = async(req,res)=>{
    const {id} = req.params;
    const userId = req.user.userId;

    const request = await VolunteerRequest.findById(id);

    if(!request){
        return res.status(404).json({message:"Request not found"});
    }

    if(request.volunteer.toString() !== userId){
        return res.status(401).json({message:"Unauthorized"});
    }

    request.status = "withdrawn";
    await request.save();

    return res.status(200).json({message:"Request Withdrawn Successfully",request});
}

module.exports = {
    UpdateStatusRequest,
    volunteerRequest,
    withdrawVolunteerRequest,
};
