import React from 'react'
import { CiCalendar } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { BsDot } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const AnnouncementCard = () => {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out rounded-md p-4 flex justify-between items-center'>
        <div className='flex flex-col gap-3 pr-4'>
            <h1 className='font-semibold text-lg'>System Maintenance Scheduled</h1>
            <p className='text-sm text-gray-500 line-clamp-2'>GroundZero will be undergoing scheduled maintenance on 06-12-2025. During this time, the platform will be unavailable for a brief period. We apologize for any inconvenience this may cause.</p>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-2 text-gray-700 text-xs'>
                <CiCalendar/>
                <p>Nov 28, 2024</p>
              </div>
              <BsDot/>
              <div className='flex items-center gap-2 text-gray-700 text-xs'>
                <IoEyeOutline/>
                <p>1,243 views</p>
              </div>
              <BsDot/>
              <div className='flex items-center gap-2 text-gray-700 text-xs'>
                <p>By Admin Team</p>
              </div>
            </div>
        </div>
        <div className='flex flex-col gap-2 pl-4 font-normal'>
            <button className='border border-gray-700/60 px-4 py-2 rounded-lg hover:border-gray-700/70 hover:bg-gray-300/20 transition-all duration-300 ease-in-out flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900'>
              <FiEdit/>
              <p>Edit</p>
            </button>
            <button className='border border-gray-700/60 px-4 py-2 rounded-lg hover:border-gray-700/70 hover:bg-gray-300/20 transition-all duration-300 ease-in-out flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900'>
              <IoEyeOutline/>
              <p>View</p>
            </button>
            <button className='border text-red-500 border-red-500/60 px-4 py-2 rounded-lg hover:border-red-500/70 hover:bg-red-500/10 transition-all duration-300 ease-in-out flex items-center gap-2 cursor-pointer'>
              <MdDeleteOutline/>
              <p>Delete</p>
            </button>
        </div>
    </div>
  )
}

export default AnnouncementCard