import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import React from "react";
import { formatStatus } from "../../utils/formatStatus";
import { formatDate } from "../../utils/formatDate";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { CgSandClock } from "react-icons/cg";
import { MdOutlineReportProblem } from "react-icons/md";

const StatusTimeLine = ({ statusHistory = [], report }) => {
    const hasInProgress = statusHistory.some(
        (history) => history.to === "in_progress"
    );
    const hasResolved = statusHistory.some(
        (history) => history.to === "resolved"
    );

    return (
        <Timeline
            sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                    fontFamily: "Poppins, sans-serif",
                },
            }}
        >
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot color="error" variant="outlined">
                        <MdOutlineReportProblem className="text-red-600" />
                    </TimelineDot>
                    <TimelineConnector
                        sx={{
                            backgroundColor: "#e69900",
                        }}
                    />
                </TimelineSeparator>
                <TimelineContent>
                    <p className="capitalize font-bold text-red-600 mt-2">
                        Reported
                    </p>
                    <p className="text-gray-700 text-xs">
                        Reported By {report?.reportedBy?.username}
                    </p>
                    <p className="text-gray-700 text-xs">
                        Reported on {formatDate(report?.reportedAt)}
                    </p>
                </TimelineContent>
            </TimelineItem>
            {statusHistory.length === 0 && (
                <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-700 mt-2 ml-2">
                    ⏳ No volunteer has picked this issue yet. 
                    <span className="text-blue-600 font-semibold cursor-pointer"> If you'd like to help, feel free to volunteer.</span>
                </div>
            )}
            {statusHistory.map((history) => {
                if (history.to === "in_progress") {
                    return (
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot variant="outlined" color="warning">
                                    <CgSandClock className="text-yellow-600" />
                                </TimelineDot>
                                <TimelineConnector
                                    sx={{
                                        backgroundColor: "#248f24",
                                    }}
                                />
                            </TimelineSeparator>
                            <TimelineContent>
                                <div className="flex flex-col gap-2">
                                    <p className="capitalize text-yellow-600 font-bold mt-2">
                                        {formatStatus(history.to)}
                                    </p>
                                    <p className="text-gray-700 text-xs">
                                        Changed By{" "}
                                        {history?.changedBy?.username}
                                    </p>
                                    <p className="text-gray-700 text-xs">
                                        Changed on {formatDate(history?.at)}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-bold">Note:</span>{" "}
                                        {history.note}
                                    </p>
                                </div>
                                {history.images?.length > 0 &&
                                    history.images.map((image, index) => (
                                        <div className="flex flex-wrap justify-start gap-3 mt-3">
                                            <img
                                                src={image.url}
                                                alt={`image-${index}`}
                                                key={index}
                                                className="h-25 w-50 object-cover"
                                            />
                                        </div>
                                    ))}
                            </TimelineContent>
                        </TimelineItem>
                    );
                }
                if (history.to === "resolved") {
                    return (
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot variant="outlined" color="success">
                                    <IoCheckmarkDoneOutline className="text-green-800" />
                                </TimelineDot>
                            </TimelineSeparator>
                            <TimelineContent>
                                <div className="flex flex-col gap-2">
                                    <p className="capitalize font-bold text-green-800 mt-2">
                                        {formatStatus(history.to)}
                                    </p>
                                    <p className="text-gray-700 text-xs">
                                        Changed By{" "}
                                        {history?.changedBy?.username}
                                    </p>
                                    <p className="text-gray-700 text-xs">
                                        Changed on {formatDate(history?.at)}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-bold">Note:</span>{" "}
                                        {history.note}
                                    </p>
                                </div>
                                {history.images?.length > 0 &&
                                    history.images.map((image, index) => (
                                        <div className="flex flex-wrap justify-start gap-3 mt-3">
                                            <img
                                                src={image.url}
                                                alt={`image-${index}`}
                                                key={index}
                                                className="h-25 w-50 object-cover"
                                            />
                                        </div>
                                    ))}
                            </TimelineContent>
                        </TimelineItem>
                    );
                }
            })}
            {hasInProgress && !hasResolved && 
                <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-700 mt-2 ml-2">
                    🚧 Work in progress. 
                    <span className="text-blue-600 font-semibold cursor-pointer"> Volunteers are making steady progress. Resolution expected soon.</span>
                </div>
            }
        </Timeline>
    );
};

export default StatusTimeLine;
