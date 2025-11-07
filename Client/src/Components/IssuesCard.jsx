import React, { useState } from "react";
import Badge from "./Badge";
import { CiLocationOn } from "react-icons/ci";
import ProfileOverlay from "./ProfileOverlay";
import CardButton from "./CardButton";
import { BiUpvote } from "react-icons/bi";
import { MdOutlineModeComment } from "react-icons/md";
import { RiShareForwardLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";

const IssuesCard = ({ isLast, report, lastItemRef }) => {
    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            ref={isLast ? lastItemRef : null}
            className="bg-white shadow-md border border-green-700/60 overflow-hidden rounded-xl flex flex-col hover:shadow-xl"
        >
            <div className="relative h-60 overflow-hidden"
                onClick={()=>navigate(`/issues/${report._id}`)}
            >
                <ProfileOverlay username={report.reportedBy.username} profile_image={report.reportedBy.profile_image} onClick={()=>navigate("/")} />
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
                <p className="text-gray-800 text-sm line-clamp-2 capitalize cursor-pointer" onClick={()=>navigate(`/issues/${report._id}`)}>
                    {report.description}
                </p>
                <div className="flex justify-between gap-1 items-center text-gray-700">
                    <div className="flex gap-1 items-center">
                        <CiLocationOn />
                        <p className="text-xs">
                            {report.village}, {report.district}
                        </p>
                    </div>
                    <div>
                      <Badge severity={report.priority} text={report.priority} inLine />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700 px-1">
                    <FaRegEye/>
                    <p>{report.views} Views</p>
                </div>
                <hr className="text-gray-400 mt-2" />
                <div className=" text-xs items-center">
                  <div className="flex gap-2 justify-around">
                    <CardButton text="Upvote" icon={BiUpvote} />
                    <CardButton text="Comment" icon={MdOutlineModeComment} />
                    <CardButton text="Share" icon={RiShareForwardLine} />
                  </div>
                </div>
            </div>
        </div>
    );
};

export default IssuesCard;
