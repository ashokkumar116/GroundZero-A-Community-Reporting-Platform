import React, { useEffect, useState } from 'react'
import { FiPlusCircle } from 'react-icons/fi'
import AnnouncementCard from '../../Components/Cards/AnnouncementCard'
import { Dropdown } from 'primereact/dropdown';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from '../../Services/axios';
import Loader from '../../Loaders/Loader';
import CreateAnnouncementModal from '../../Components/Modals/CreateAnnouncementModal';

const ManageAnnouncements = () => {
  const [page,setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);
  const [limit,setLimit] = useState(5);
  const [loading,setLoading] = useState(false);
  const [announcements,setAnnouncements] = useState([]);
  const [createAnnouncementModalVisible,setCreateAnnouncementModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formLoading,setFormLoading] = useState(false);

  const fetchAnnouncements = async()=>{
    try {
      setLoading(true);
      const response = await axios.get("/admin/announcement/fetch",{
        params:{
          page,
          limit
        }
      });
      setAnnouncements(response.data.announcements);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch announcements");
    }finally{
      setLoading(false);
    }
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!title || !description){
      toast.error("All fields are required");
      return;
    }
    try {
      setFormLoading(true);
      const formData = new FormData();
      formData.append('title',title);
      formData.append('description',description);
      if(selectedImages){
        selectedImages.forEach((image)=>formData.append('images',image));
      }
      const response = await axios.post("/admin/announcement/create",formData);
      if(response.status === 201){
        toast.success("Announcement created successfully");
        fetchAnnouncements();
        setCreateAnnouncementModalVisible(false);
        setSelectedImages([]);
        setTitle("");
        setDescription("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create announcement");
    }finally{
      setFormLoading(false);
    }
  }

  useEffect(()=>{
    fetchAnnouncements();
  },[page,limit])

  if(loading){
    return <div className='flex justify-center items-center h-screen'><Loader /></div>
  }

  return (
    <div>
      <CreateAnnouncementModal visible={createAnnouncementModalVisible} setVisible={setCreateAnnouncementModalVisible} selectedImages={selectedImages} setSelectedImages={setSelectedImages} title={title} setTitle={setTitle} description={description} setDescription={setDescription} handleSubmit={handleSubmit} loading={formLoading} />
      <div className='flex justify-between items-center'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold'>Manage Announcements</h1>
          <p className='text-gray-700'>Create and manage platform announcements</p>
        </div>
        <div>
          <button className='bg-gradient-to-br from-green-500 to-emerald-600 text-white px-4 py-2 rounded-md hover:from-green-600 hover:to-emerald-700 transition duration-300 ease-in-out hover:cursor-pointer flex items-center gap-2'
            onClick={()=>setCreateAnnouncementModalVisible(true)}
          >
            <FiPlusCircle />
            <p>New Announcement</p>
          </button>
        </div>
      </div>
      <div className='flex flex-col gap-4 mt-10'>
        {
          announcements.map((announcement)=>(
            <AnnouncementCard key={announcement._id} announcement={announcement} />
          ))
        }
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