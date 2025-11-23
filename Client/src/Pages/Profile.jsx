import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../lib/authStore'
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../Services/axios';
import { MdMailOutline } from "react-icons/md";
import { FiBarChart, FiEdit } from "react-icons/fi";
import { RiImageEditLine } from "react-icons/ri";
import { toast } from 'react-hot-toast';
import Loader from '../Loaders/Loader';
import { FiFileText } from "react-icons/fi";
import PersonalInfoCard from '../Components/Cards/PersonalInfoCard';
import { LuPhone } from "react-icons/lu";
import { MdOutlineDateRange } from "react-icons/md";
import { IoBarChart, IoBarChartOutline, IoLocationOutline } from "react-icons/io5";
import { LuMap } from "react-icons/lu";
import { TbWorld } from "react-icons/tb";
import { FaArrowRight, FaHashtag } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import Back from '../Components/Buttons/Back';
import { AiOutlineBarChart } from "react-icons/ai";
import { formatDate } from '../utils/formatDate';
import ProfileEditModal from '../Components/Modals/ProfileEditModal';
import ProfileSkeleton from '../Skeletons/ProfileSkeleton';

const Profile = () => {
  const {user,upadateProfileImage} = useAuthStore();
  const {id} = useParams();
  const navigate = useNavigate();

  const [modalVisible,setModalVisible] = useState(false);

  useEffect(()=>{
    if(id){
      fetchUser();
    }
  },[id]);


  const [isUploading,setIsUploading] = useState(false);

  const [userDetails,setUserDetails] = useState({});
  const [isFetching,setIsFetching] = useState(false);
  const [scrolled,setScrolled] = useState(false);



  const fetchUser = async()=>{
    try {
      setIsFetching(true);
      const response = await axios.get(`/users/getuser/${id}`);
      setUserDetails(response.data.user[0]);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }finally{
      setIsFetching(false);
    }
  }

  if(isFetching){
    return <ProfileSkeleton />
  }

 


  const handleImageUpdate = async(e)=>{
    e.preventDefault();
    try {
      setIsUploading(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image',file);
      const res = await axios.post('/users/updateprofileimage',formData);
      if(res.status === 200){
        fetchUser();
        upadateProfileImage(res.data.user.profile_image);
        toast.success('Profile Image Updated Successfully');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }finally{
      setIsUploading(false);
    }
  }

  console.log("Frontend user: ", userDetails);

      const handleScroll = () => {
          if (window.scrollY > 5) {
              setScrolled(true);
          } else {
              setScrolled(false);
          }
      };
      window.addEventListener("scroll", handleScroll);

  return (
    <div className='py-35 px-10 lg:px-20 bg-gray-100 flex flex-col gap-10'>
      <Back scrolled={scrolled} />
      <div className='bg-gradient-to-br from-green-500 to-teal-800 w-full h-130 rounded-4xl shadow-xl flex flex-col overflow-hidden'>
        <div className='flex-2 lg:flex-1'></div>
        <div className='flex-6 lg:flex-1 bg-white p-5 flex flex-col lg:flex-row justify-between gap-4'>
            <div className='relative flex-1'>
              <div className='p-2 bg-white absolute -top-20 rounded-2xl shadow-md shadow-teal-500/30'>
              <img src={userDetails?.profile_image} className='h-30 w-30 lg:h-40 lg:w-40  object-cover rounded-2xl' />
              {
                user._id === id && (
                  <>
                    <input type="file" className='hidden' id='profile' onChange={handleImageUpdate} disabled={isUploading} />
                    {
                      isUploading ? (
                        <label htmlFor='profile' className='absolute -bottom-2 -right-2 p-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full cursor-pointer'>
                            <span className='loading loading-sm'></span>
                        </label>
                      ) : (
                        <label htmlFor='profile' className='absolute -bottom-2 -right-2 p-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full cursor-pointer'>
                          <RiImageEditLine className='text-xl text-white' />
                        </label>
                      )
                    }
                  </>
                )
              }
            </div>
            </div>
            <div className='flex-3 lg:flex-3 xl:flex-5 flex flex-col gap-2 mt-5 '>
              <h1 className='text-3xl text-black font-bold uppercase text-emerald-600'>{userDetails?.username}</h1>
              <div className='text-sm text-gray-700 flex items-center gap-2'>
                <MdMailOutline />
                <p>{userDetails?.email}</p>
              </div>
              <p className='text-gray-700 text-sm'>{userDetails?.bio}</p>
            </div>
            {
              user._id === id && (
                <div className='flex-1'>
                  <button className='px-3 py-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl flex items-center gap-2 hover:scale-103 cursor-pointer transition'
                    onClick={()=>setModalVisible(true)}
                  >
                    <FiEdit />
                    <p>Edit Profile</p>
                  </button>
                </div>
              )
            }
        </div>
      </div>
      <div className='flex flex-col lg:flex-row gap-5 h-full '>
        <div className='bg-white shadow-xl p-10 rounded-4xl flex flex-col gap-5 flex-2'>
            <div className='flex items-center gap-2'>
              <div className='p-2 text-white bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl'>
                <FiFileText className='text-2xl' />
              </div>
              <h1>Personal Information</h1>
            </div>
            <div className='flex flex-wrap gap-5'>
              <PersonalInfoCard icon={LuPhone} heading="Phone Number" data={userDetails?.phone}/>
              <PersonalInfoCard icon={MdOutlineDateRange} heading="Date of Birth" data={userDetails?.dob ? formatDate(userDetails?.dob) : ""}/>
              <PersonalInfoCard icon={IoLocationOutline} heading="Village" data={userDetails?.village_name}/>
              <PersonalInfoCard icon={LuMap} heading="District" data={userDetails?.district}/>
              <PersonalInfoCard icon={LuMap} heading="State" data={userDetails?.state}/>
              <PersonalInfoCard icon={TbWorld} heading="Country" data={userDetails?.country || "India"}/>
              <PersonalInfoCard icon={FaHashtag} heading="Postal Code" data={userDetails?.pincode}/>
            </div>
        </div>
        <div className='flex flex-1 flex-col gap-3 text-white'>
            <div className='flex-1 bg-gradient-to-br from-emerald-500 to-green-400 rounded-4xl relative overflow-hidden  p-7 flex flex-col items-start justify-around'>
              <div className='absolute bg-emerald-300/40 h-50 w-50 rounded-full -top-20 -right-20'></div>
              <div className='absolute bg-emerald-300/40 h-40 w-40 rounded-full -bottom-25 -left-25'></div>
              <div className='bg-emerald-300/50 inline-flex p-3 rounded-xl'>
                <FaRegHeart className='text-3xl text-white' />
              </div>
              <div className='flex flex-col gap-3 mt-5'>
                <h1 className='font-bold'>Volunteer Impact</h1>
                <p className='text-sm'>Your contribution to making a difference in the community</p>
              </div>
              <div className='mt-5 flex flex-col w-full gap-5'>
                <div className='bg-emerald-300/50 p-4 rounded-xl flex justify-between items-center'>
                  <h1>Total Volunteered</h1>
                  <p>{userDetails?.volunteer_works?.length}</p>
                </div>
                <div className='flex gap-5 flex-wrap items-center justify-between'>
                  <div className='bg-emerald-300/50 p-4 rounded-xl flex justify-between items-center flex-1' >
                    <h1>Active Campaigns</h1>
                    <p>{userDetails?.volunteer_works?.filter(w => w.status !== "resolved").length}</p>
                  </div>
                  <div className='bg-emerald-300/50 p-4 rounded-xl flex justify-between items-center flex-1'>
                    <h1>Resolved Campaigns</h1>
                    <p>{userDetails?.volunteer_works?.filter(w => w.status === "resolved").length}</p>
                  </div>
                </div>
                <div className='flex items-center justify-center'>
                  <button className='flex items-center gap-2 bg-white text-emerald-600 font-semibold px-5 py-3 w-[90%] justify-center rounded-xl shadow-md hover:scale-101 transition group cursor-pointer'
                    onClick={()=>navigate(`/volunteer-works/${userDetails._id}`)}
                  >
                    <p>View Details</p>
                    <FaArrowRight className='group-hover:translate-x-2 transition' />
                  </button>
                </div>
                <div className='px-5'>
                  <hr className='my-3 text-emerald-300' />
                </div>
                <div className='mb-3 xl:mb-10' >
                  <p className='text-center'>"Every action counts. Together, we create change."</p>
                </div>
              </div>
            </div>
            <div className='flex-1 bg-gradient-to-br from-emerald-500 to-green-400 rounded-4xl relative overflow-hidden p-5 flex flex-col items-start justify-around'>
              <div className='absolute bg-emerald-300/40 h-50 w-50 rounded-full -top-20 -right-20'></div>
              <div className='absolute bg-emerald-300/40 h-40 w-40 rounded-full -bottom-25 -left-25'></div>
              <div className='bg-emerald-300/50 inline-flex p-3 rounded-xl'>
                <AiOutlineBarChart className='text-3xl text-white' />
              </div>
              <div className='flex flex-col gap-3 mt-5'>
                <h1 className='font-bold'>My Posts</h1>
                <p className='text-sm'>Track and manage your community reports</p>
              </div>
              <div className='mt-5 flex flex-col gap-5 w-full'>
                <div className='bg-emerald-300/50 p-4 rounded-xl flex justify-between items-center'>
                  <h1>Total Posts</h1>
                  <p>{userDetails?.posts?.length}</p>
                </div> 
                <div className='flex gap-5 flex-wrap items-center justify-between'>
                  <div className='bg-emerald-300/50 p-4 rounded-xl flex justify-between items-center flex-1'>
                    <h1>Active</h1>
                    <p>{userDetails?.posts?.filter(w => w.status !== "resolved").length}</p>
                  </div>
                  <div className='bg-emerald-300/50 p-4 rounded-xl flex justify-between items-center flex-1'>
                    <h1>Resolved</h1>
                    <p>{userDetails?.posts?.filter(w => w.status === "resolved").length}</p>
                  </div>
                </div>
                <div className='flex items-center justify-center'>
                  <button className='flex items-center gap-2 bg-white text-emerald-600 font-semibold px-5 py-3 w-[90%] justify-center rounded-xl shadow-md hover:scale-101 transition group cursor-pointer'
                    onClick={()=>navigate(`/user-reports/${userDetails?._id}`)}
                  >
                    <p>View Details</p>
                    <FaArrowRight className='group-hover:translate-x-2 transition' />
                  </button>
                </div>
                <div className='px-5'>
                  <hr className='my-3 text-emerald-300' />
                </div>
                <div className='' >
                  <p className='text-center'>“Community heroes don’t wear capes—they raise their voice.”</p>
                </div>
              </div>
            </div>
        </div>
      </div>
      <ProfileEditModal visible={modalVisible} setVisible={setModalVisible} user={userDetails} fetchUser={fetchUser} className="" />
    </div>
  )
}

export default Profile
