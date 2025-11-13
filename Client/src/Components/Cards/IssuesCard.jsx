import React, { useEffect, useState } from "react";
import Badge from "../UI/Badge";
import { CiLocationOn } from "react-icons/ci";
import ProfileOverlay from "../UI/ProfileOverlay";
import { BiUpvote } from "react-icons/bi";
import { MdOutlineModeComment } from "react-icons/md";
import { RiShareForwardLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { HashLink } from "react-router-hash-link";
import { toast } from "react-hot-toast";
import axios from "../../Services/axios";
import CardButton from "../UI/CardButton";
import { BiSolidUpvote } from "react-icons/bi";
import { useAuthStore } from "../../lib/authStore";

const IssuesCard = ({ isLast, report, lastItemRef, userId }) => {

    const {user} = useAuthStore();


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
                    onClick={() => navigate("/")}
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
                    className="text-gray-800 text-sm line-clamp-2 capitalize cursor-pointer prose prose-invert leading-relaxed max-w-none"
                    dangerouslySetInnerHTML={{__html:report.description}}
                />
                <div className="flex justify-between gap-1 items-center text-gray-700">
                    <div className="flex gap-1 items-center">
                        <CiLocationOn />
                        <p className="text-xs">
                            {report.village}, {report.district}
                        </p>
                    </div>
                    <div>
                        <Badge
                            severity={report.priority}
                            text={report.priority}
                            inLine
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700 px-1">
                    <FaRegEye />
                    <p>{report.views} Views</p>
                </div>
                <hr className="text-gray-400 mt-2" />
                <div className=" text-xs items-center">
                    <div className="flex gap-2 justify-around text-xs">
                        <button
                            className={`flex gap-1 items-center cursor-pointer text-sm text-gray-700 px-3 py-1`}
                            onClick={handleUpvote}
                        >
                            {hasUserUpvoted ? <BiSolidUpvote className="text-green-700" /> : <BiUpvote className={``} />}
                            
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
                </div>
            </div>
        </div>
    );
};

export default IssuesCard;
