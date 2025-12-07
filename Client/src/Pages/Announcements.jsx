import toast from 'react-hot-toast';
import AnnouncementCard from '../Components/Cards/AnnouncementCard';
import axios from '../Services/axios';
import React, { useEffect, useState } from 'react'
import Loader from '../Loaders/Loader';

const Announcements = () => {

  const [announcements, setAnnouncements] = useState([]);
  const [loading,setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/announcement/fetch",{
        params:{
          page:1,
          limit:20
        }
      })

      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch announcements");
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  },[]);

  if(loading){
    return <div className='flex justify-center items-center h-screen'><Loader/></div>
  }

  return (
    <div className='px-20 py-30'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Announcements</h1>
      </div>
      <div className='mt-10 flex flex-col gap-5'>
        {
          announcements.map((announcement)=>(
            <AnnouncementCard key={announcement._id} announcement={announcement} isUserSide={true} />
          ))
        }
      </div>
    </div>
  )
}

export default Announcements