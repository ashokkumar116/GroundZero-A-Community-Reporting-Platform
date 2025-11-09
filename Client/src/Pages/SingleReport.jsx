import axios from "../Services/axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextArrow, PrevArrow } from "../Components/UI/Arrows";
import { formatDate } from "../utils/formatDate";
import { CiLocationOn } from "react-icons/ci";
import Badge from "../Components/UI/Badge";
import { formatStatus } from "../utils/formatStatus";
import { FaRegEye } from "react-icons/fa";
import { BiUpvote } from "react-icons/bi";
import { IoCaretBackCircleOutline } from "react-icons/io5";
import { MdOutlineModeComment } from "react-icons/md";
import { MdOutlineVolunteerActivism } from "react-icons/md";
import { FaRegFrownOpen } from "react-icons/fa";
import VolunteerCard from "../Components/Cards/VolunteerCard";
import StatusTimeLine from "../Components/UI/StatusTimeLine";
import { Editor } from 'primereact/editor';
import { TbSend } from "react-icons/tb";
import Back from "../Components/Buttons/Back";

const SingleReport = () => {
    const { id } = useParams();
    const [report, setReport] = useState({});
    const [loading, setLoading] = useState(false);

    const [scrolled, setScrolled] = useState(false);

    const navigate = useNavigate();

    const fetchReport = async () => {
        try {
            setLoading(true);
            const report = await axios.get(`/reports/fetchsingle/${id}`);
            setReport(report.data.report);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [id]);

    useEffect(() => {
        console.log(report);
    }, [report]);

    if (loading) {
        return <p className="py-30 px-20 text-center">Loading</p>;
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
    };

    const handleScroll = () => {
        if (window.scrollY > 5) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };
    window.addEventListener("scroll", handleScroll);

    return (
        <div className="py-30 px-20 bg-gray-200">
            <Back scrolled={scrolled} />
            <button
                onClick={() => navigate(-1)}
                className={`bg-gradient-to-br from-green-500 to-green-800 px-2 py-2 text-white rounded-lg flex items-center gap-1 hover:scale-105 transition-all duration-300 cursor-pointer fixed bottom-10 right-10 z-30`}
            >
                <MdOutlineVolunteerActivism className="text-white text-lg" />
                <p className="transition">Become a Volunteer</p>
            </button>
            <div className="flex items-start mt-5 bg-white p-5 rounded-2xl shadow-lg gap-15 ">
                <div className="flex flex-col w-[50%]">
                    <div className="mb-5 flex items-center gap-2">
                        <div>
                            <img
                                src={report?.reportedBy?.profile_image}
                                alt=""
                                className="h-10 rounded-full border border-green-600/70"
                            />
                        </div>
                        <div>
                            <h5 className="font-bold">
                                {report?.reportedBy?.username}
                            </h5>
                            <p className="text-xs text-gray-700">
                                Reported on {formatDate(report?.reportedAt)}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="text-xl font-bold text-green-700">
                            {report?.title}
                        </h1>
                        <p className="text-sm text-gray-700 text-justify">
                            {report?.description}
                        </p>
                        <div className="flex items-center gap-3">
                            <CiLocationOn className="text-green-600 text-[20px]" />
                            <p className="text-gray-700">
                                {report?.village}, {report?.district},{" "}
                                {report?.state} - {report?.pincode}
                            </p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <Badge
                                text={`Priority : ${report?.priority}`}
                                severity={report?.priority}
                                inLine
                            />
                        </div>
                        <div className="px-1 flex flex-col gap-4 mt-2 text-sm text-gray-700">
                            <div className="px-2 py-2 border border-green-800 rounded-md">
                                <p className="capitalize text-green-700 font-bold">
                                    Current Status :{" "}
                                    {formatStatus(report?.status)}
                                </p>
                            </div>
                            <div className="flex justify-start gap-5 bg-gradient-to-br from-green-600 to-green-900 text-white px-3 py-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <FaRegEye />
                                    <p>{report?.views} Views</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BiUpvote />
                                    <p>{report?.upvotes} Upvotes</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MdOutlineModeComment />
                                    <p>
                                        {report?.comments?.length || 0} Comments
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[50%] relative mb-4">
                    <Badge text={report?.category} />
                    <Slider {...settings}>
                        {report?.images?.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={`report-${index}`}
                                className="h-96 w-96 object-cover rounded-lg"
                            />
                        ))}
                    </Slider>
                </div>
            </div>
            <div>
                <div className="flex flex-col mt-5 bg-white p-5 rounded-2xl shadow-lg gap-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-black font-bold text-xl">
                            Volunteers Working on this issue
                        </h1>
                    </div>
                    <div>
                        {report?.volunteers?.length > 0 ? (
                            report?.volunteers?.map((volunteer, index) => (
                                <div>
                                    <VolunteerCard
                                        volunteer={volunteer.volunteer}
                                        joinedAt={volunteer.joinedAt}
                                        key={index}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="mt-5 flex flex-col items-center gap-2 text-gray-700">
                                <FaRegFrownOpen className="text-5xl" />
                                <p className="text-center font-medium">
                                    No volunteers are working on this issue yet.
                                </p>
                                <p className="text-center text-sm text-gray-500 max-w-sm">
                                    Be the first to make a difference! Join as a
                                    volunteer and help resolve this issue for
                                    your community.
                                </p>
                                <button className="mt-3 bg-gradient-to-br from-green-500 to-green-800 hover:scale-105 text-white px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer flex items-center gap-2">
                                    <MdOutlineVolunteerActivism className="text-white text-lg" />
                                    <p>Become a Volunteer</p>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex gap-10">
                <div className="flex flex-col mt-5 bg-white p-5 rounded-2xl shadow-lg gap-4 flex-1">
                        <div>
                            <h1 className="text-2xl font-bold">Work History</h1>
                        </div>
                        <div>
                            <StatusTimeLine
                            key={report._id}
                            statusHistory={report.history}
                            report={report}
                        />
                        </div>
                </div>
                <div className="flex flex-col mt-5 bg-white p-5 rounded-2xl shadow-lg gap-4 flex-1">
                    <div className="flex flex-col gap-3">
                        <div>
                            <Editor />
                        </div>
                        <div>
                            <button className="px-2 py-2 bg-gradient-to-br from-emerald-500 to-emerald-800 text-white shadow-md hover:scale-102 transition rounded-md cursor-pointer flex items-center gap-2">
                                <TbSend />
                                <p>Send</p>
                            </button>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h1 className="text-2xl font-bold">Comments</h1>
                        </div>
                        <div className="overflow-y-scroll no-scrollbar h-100">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleReport;
