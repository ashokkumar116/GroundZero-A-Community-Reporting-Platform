const Reports = require("../models/Reports");
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

module.exports = {
    reviewVolunteerRequest,
};
