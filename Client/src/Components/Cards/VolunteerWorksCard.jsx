import React, { useEffect, useState } from "react";
import Badge from "../UI/Badge";
import { CiLocationOn } from "react-icons/ci";
import ProfileOverlay from "../Overlays/ProfileOverlay";
import { BiUpvote } from "react-icons/bi";
import { MdOutlineModeComment, MdOutlineModeEdit } from "react-icons/md";
import { RiShareForwardLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { HashLink } from "react-router-hash-link";
import { toast } from "react-hot-toast";
import axios from "../../Services/axios";
import CardButton from "../Buttons/CardButton";
import { BiSolidUpvote } from "react-icons/bi";
import { useAuthStore } from "../../lib/authStore";
import { FaRegEdit } from "react-icons/fa";
import { formatStatus } from "../../utils/formatStatus";
import UpdateStatusRequestModal from "../Modals/UpdateStatusRequestModal";

const IssuesCard = ({ isLast, report, lastItemRef, userId }) => {

    const {user} = useAuthStore();

    const [updateStatusVisible, setUpdateStatusVisible] = useState(false);


    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();

    const [localReport, setLocalReport] = useState(report);

    
    
    useEffect(() => {
        setLocalReport(report);
    }, [report]);
    
    const handleUpvote = async (e) => {
        // e.preventDefault();
        try {

            if(!user){
                toast.error("Please Login to Upvote");
                navigate("/login");
                return;
            }

            const res = await axios.post(`/reports/upvote/${report._id}`);
            if (res.status === 200) {
                const isUpvoted = res.data.message.includes(
                    "Upvoted Successfully"
                );
                
                setLocalReport((prev) => {
                    const newUpvote = isUpvoted
                    ? prev.upvotes + 1
                    : prev.upvotes - 1;
                    const newUpvotedBy = isUpvoted
                    ? [...prev.upvotesBy, userId]
                    : prev.upvotesBy.filter((id) => id !== userId);
                    
                    return {
                        ...prev,
                        upvotes: newUpvote,
                        upvotesBy: newUpvotedBy,
                    };
                });
                
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    };
    
    const hasUserUpvoted = localReport.upvotesBy.includes(userId);
    const upvoteTextColor = hasUserUpvoted ? "text-green-700" : "text-gray-700";

    const handleShare = async()=>{
        const url = encodeURI(`${window.location.origin}/issues/${report._id}`)
        if(navigator.share){
            try {
                await navigator.share({
                    title: report.title,
                    text: report.description,
                    url: url
                })
            } catch (error) {
                console.log(error)
            }
        }else{
            toast.error("Your browser doesn't support sharing")
        }
    }
    
    return (
        <div
        ref={isLast ? lastItemRef : null}
        className="bg-white shadow-md border border-green-700/60 overflow-hidden rounded-xl flex flex-col hover:shadow-xl"
        >
            <div
                className="relative h-60 overflow-hidden"
                onClick={() => navigate(`/issues/${report._id}`)}
            >
                <ProfileOverlay
                    username={report.reportedBy.username}
                    profile_image={report.reportedBy.profile_image}
                    onClick={() => navigate(`/profile/${report.reportedBy._id}`)}
                />
                <Badge text={report.category} />
                <div>
                    <img
                        src={report.images[0].url}
                        alt={report.title}
                        className="absolute inset-0 h-full w-full hover:scale-105 transition duration-300 mb-3 object-cover cursor-pointer"
                        onMouseOver={() => setIsHovering(true)}
                        onMouseOut={() => setIsHovering(false)}
                    />
                </div>

                <div
                    className={`absolute inset-0 bg-gradient-to-t from-green-900/70 ${
                        isHovering ? "from-green-900/90" : null
                    } via-transparent to-gray-600/70 pointer-events-none transition`}
                ></div>

                <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                    <h1 className="text-lg font-bold text-white drop-shadow-md px-2 line-clamp-1 capitalize">
                        {report.title}
                    </h1>
                </div>
            </div>
            <div className="mt-2 px-2 flex flex-col gap-2 mb-2">
                <div
                    onClick={() => navigate(`/issues/${report._id}`)}
                    className="!text-gray-700 text-sm line-clamp-2 capitalize cursor-pointer prose prose-invert leading-relaxed max-w-none"
                    dangerouslySetInnerHTML={{__html:report.description}}
                />
                <div className="flex flex-col md:flex-row gap-3 md:gap-5 justify-between md:items-center">
                    <div className="flex flex-row md:flex-col justify-between md:justify-start gap-1 items-start gap-2 text-gray-700">
                    <div className="flex gap-1 items-center">
                        <CiLocationOn />
                        <p className="text-xs">
                            {report.village}, {report.district}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700 px-1">
                        <FaRegEye />
                        <p>{report.views} Views</p>
                    </div>
                </div>
                <div className="flex flex-row md:flex-col justify-between gap-1 items-start gap-2 text-gray-700">
                    <div className="flex justify-between w-full gap-1 items-center">
                        <Badge
                            severity={report.priority}
                            text={report.priority}
                            inLine
                        />
                    </div>
                    <div className="px-2 py-1 bg-green-600/50 border border-green-600/50 text-emerald-900 rounded-full w-full flex justify-center items-center text-xs">
                        <p className="capitalize">{formatStatus(report.status)}</p>
                    </div>
                </div>
                </div>
                
                <hr className="text-gray-400 mt-2" />
                <div className=" text-xs items-center">
                    {userId === report.volunteers[0].volunteer ? (
                        <div className="flex flex-col items-center xl:flex-row gap-2 justify-around text-xs">
                        <button className="flex gap-1 items-center justify-center cursor-pointer text-sm text-gray-700 px-5 py-3 bg-gradient-to-br from-green-500 to-emerald-800 text-white rounded-2xl hover:scale-102 transition duration-300 w-[80%]"
                            onClick={() => setUpdateStatusVisible(true)}
                        >
                            <FaRegEdit />
                            <p>Update Status</p>
                        </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center xl:flex-row gap-2 justify-around text-xs">
                        <button
                            className={`flex gap-1 items-center cursor-pointer text-sm text-gray-700 px-3 py-1`}
                            onClick={handleUpvote}
                        >
                            {hasUserUpvoted ? <BiSolidUpvote className="text-green-700" /> : <BiUpvote className={`text-gray-700 ${upvoteTextColor}`} />}
                            
                            <p className={`text-xs ${upvoteTextColor} ${hasUserUpvoted ? "font-bold":""} `}>{`${localReport.upvotes} Upvotes`}</p>
                        </button>
                        <HashLink 
                            to={`/issues/${report._id}/#commentsection`}
                            className="flex gap-1 items-center cursor-pointer text-xs text-gray-700 px-3 py-1"
                        >
                            <MdOutlineModeComment />
                            <p className="text-xs">{`${report.comments.length} Comments`}</p>
                        </HashLink>
                        <CardButton text="Share" icon={RiShareForwardLine} onClick={handleShare} />
                    </div>
                    )}
                </div>
            </div>
            <UpdateStatusRequestModal visible={updateStatusVisible} setVisible={setUpdateStatusVisible} reportId={report._id} />
        </div>
    );
};

export default IssuesCard;
