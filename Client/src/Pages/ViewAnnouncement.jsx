import axios from '../Services/axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../Loaders/Loader';
import Back from '../Components/Buttons/Back';
import { formatDate } from '../utils/formatDate';
import { CiCalendar } from 'react-icons/ci';
import Slider from 'react-slick';
import { NextArrow, PrevArrow } from '../Components/UI/Arrows';
import { IoEyeOutline } from 'react-icons/io5';
import { FaRegClock } from "react-icons/fa";
import { timeAgo } from '../utils/timeAgo';

const ViewAnnouncement = () => {
    const {id} = useParams(); 
    const [announcement,setAnnouncement] = useState({});
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const [scrolled,setScrolled] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 5) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };
    window.addEventListener("scroll", handleScroll);


    const fetchAnnouncement = async()=>{
        try {
            setLoading(true);
            const response = await axios.get(`/admin/announcement/fetch/${id}`);
            setAnnouncement(response.data.announcement);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch announcement");
        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchAnnouncement();
    },[id]);

    useEffect(()=>{
        console.log(announcement);
    },[announcement]);

    if(loading){
        return <div className='flex justify-center items-center h-screen'><Loader /></div>
    }

    if(!announcement){
        return <div className='flex justify-center items-center h-screen'><p>Announcement not found</p></div>
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

    

  return (
    <div className='px-20 py-35 bg-gray-100'>
        <Back scrolled={scrolled} />
        <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-5'>
                <p className='text-2xl font-bold'>{announcement.title}</p>
            </div>
            <div className='flex items-center gap-2'>
                <div>
                    <img src={announcement?.postedBy?.profile_image} alt="" className='w-10 h-10 rounded-full' />
                </div>
                <div className='flex flex-col text-gray-700'>
                    <p className='font-semibold'>Posted By {announcement?.postedBy?.username}</p>
                    <p className='flex items-center gap-1 text-sm'><CiCalendar/><span>{formatDate(announcement?.createdAt)}</span></p>
                </div>
            </div>
            
            <div className="w-full max-w-xl mx-auto mb-4 ">
                {
                    announcement?.images?.length > 0 ? (
                        <Slider {...settings}>
                            {announcement?.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={`report-${index}`}
                                    className="h-96 w-full object-cover rounded-lg"
                                />
                            ))}
                        </Slider>
                    ) : (
                        <img src="/announcement.png" alt="" className='h-96 object-cover rounded-lg' />
                    )
                }
            </div>
            <div className='mt-5 bg-white shadow-md p-5 rounded-lg'>
                <p>{announcement.description}</p>
            </div>
            <div className='mt-5 bg-white shadow-md p-5 rounded-lg flex items-center gap-8'>
                <p className='flex items-center gap-1 text-sm text-gray-700'>
                    <IoEyeOutline/>
                    <span>{announcement?.views} views</span>
                </p>
                <p className='flex items-center gap-1 text-sm text-gray-700'>
                    <FaRegClock/>
                    <span>Last updated {timeAgo(announcement?.editedAt)}</span>
                </p>
            </div>
        </div>
    </div>
  )
}

export default ViewAnnouncement