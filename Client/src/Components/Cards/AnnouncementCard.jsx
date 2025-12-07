import React, { useState } from 'react'
import { CiCalendar } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { BsDot } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { formatDate } from '../../utils/formatDate';
import { useNavigate } from 'react-router-dom';

import { ConfirmPopup } from 'primereact/confirmpopup'; // To use <ConfirmPopup> tag
import { confirmPopup } from 'primereact/confirmpopup'; // To use confirmPopup method
import axios from '../../Services/axios';
import toast from 'react-hot-toast';
import Loader from '../../Loaders/Loader';

const AnnouncementCard = ({announcement,handleEditShow,fetchAnnouncements}) => {
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const deleteAnnouncement = async()=>{
    try {
      setLoading(true);
      const response = await axios.delete(`/admin/announcement/delete/${announcement._id}`);
      if(response.status === 200){
        toast.success("Announcement deleted successfully");
        fetchAnnouncements();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete announcement");
    }finally{
      setLoading(false);
    }
  }

  const confirmDelete = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Do you want to delete this Announcement?',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept:()=>{
                deleteAnnouncement();
            },
            reject:()=>{
                
            }
        });
    };

    if(loading){
      return <div className='flex justify-center items-center h-[calc(100vh-10rem)]'><Loader/></div>
    }


  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out rounded-md p-4 flex justify-between items-center'>
        <div className='flex flex-col gap-3 pr-4'>
            <h1 className='font-semibold text-lg'>{announcement.title}</h1>
            <p className='text-sm text-gray-500 line-clamp-2'>{announcement.description}</p>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-2 text-gray-700 text-xs'>
                <CiCalendar/>
                <p>{formatDate(announcement.createdAt)}</p>
              </div>
              <BsDot/>
              <div className='flex items-center gap-2 text-gray-700 text-xs'>
                <IoEyeOutline/>
                <p>{announcement.views} views</p>
              </div>
              <BsDot/>
              <div className='flex items-center gap-2 text-gray-700 text-xs'>
                <p>By {announcement.postedBy.username}</p>
              </div>
            </div>
        </div>
        <div className='flex flex-col gap-2 pl-4 font-normal'>
            <button className='border border-gray-700/60 px-4 py-2 rounded-lg hover:border-gray-700/70 hover:bg-gray-300/20 transition-all duration-300 ease-in-out flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900'
            onClick={()=>handleEditShow(announcement)}
            >
              <FiEdit/>
              <p>Edit</p>
            </button>
            <button className='border border-gray-700/60 px-4 py-2 rounded-lg hover:border-gray-700/70 hover:bg-gray-300/20 transition-all duration-300 ease-in-out flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900'
          onClick={()=>navigate(`/announcement/${announcement._id}`)}>
              <IoEyeOutline/>
              <p>View</p>
            </button>
            <ConfirmPopup />
            <button className='border text-red-500 border-red-500/60 px-4 py-2 rounded-lg hover:border-red-500/70 hover:bg-red-500/10 transition-all duration-300 ease-in-out flex items-center gap-2 cursor-pointer'
            onClick={confirmDelete}
            >
              <MdDeleteOutline/>
              <p>Delete</p>
            </button>
        </div>
    </div>
  )
}

export default AnnouncementCard