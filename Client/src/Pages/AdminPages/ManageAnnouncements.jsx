import React, { useState } from 'react'
import { FiPlusCircle } from 'react-icons/fi'
import AnnouncementCard from '../../Components/Cards/AnnouncementCard'
import { Dropdown } from 'primereact/dropdown';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const ManageAnnouncements = () => {
  const [page,setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);
  const [limit,setLimit] = useState(5);

  

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold'>Manage Announcements</h1>
          <p className='text-gray-700'>Create and manage platform announcements</p>
        </div>
        <div>
          <button className='bg-gradient-to-br from-green-500 to-emerald-600 text-white px-4 py-2 rounded-md hover:from-green-600 hover:to-emerald-700 transition duration-300 ease-in-out hover:cursor-pointer flex items-center gap-2'>
            <FiPlusCircle />
            <p>New Announcement</p>
          </button>
        </div>
      </div>
      <div className='flex flex-col gap-4 mt-10'>
        <AnnouncementCard />
      </div>
      <div className='flex justify-between items-center mt-5'>
        <div >
          <p>Page {page} of {totalPages}</p>
        </div>
        <div className='flex gap-3 items-center'>
          <button onClick={()=>setPage(page-1)} disabled={page===1} className='p-2 rounded-full hover:bg-gray-200 transition duration-300 ease-in-out disabled:opacity-50 hover:cursor-pointer'><MdKeyboardArrowLeft /></button>
          {
            Array.from({length:totalPages},(_,i)=>(
              <button key={i} onClick={()=>setPage(i+1)} className={`p-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition duration-300 ease-in-out hover:cursor-pointer ${page===i+1 ? "bg-green-100/90 text-green-700" : ""}`} disabled={page===i+1}>
                {i+1}
              </button>
            ))
          }
          <button onClick={()=>setPage(page+1)} disabled={page===totalPages} className='p-2 rounded-full hover:bg-gray-200 transition duration-300 ease-in-out disabled:opacity-50 hover:cursor-pointer'><MdKeyboardArrowRight /></button>
        </div>
        <div className='flex gap-3 items-center'>
          <p>Rows per page</p>
          <Dropdown value={limit} options={[5,10,15,20]} onChange={(e)=>setLimit(e.value)} />
        </div>
      </div>
    </div>
  )
}

export default ManageAnnouncements