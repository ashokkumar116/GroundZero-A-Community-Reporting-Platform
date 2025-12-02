import React from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineVolunteerActivism } from 'react-icons/md'
import { RxUpdate } from 'react-icons/rx'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { useState } from 'react'
import axios from '../../Services/axios'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { formatDateTime } from '../../utils/formatDateTime'
import { LuDot } from 'react-icons/lu'
import { SiTicktick } from "react-icons/si";
import { GiReturnArrow } from "react-icons/gi";
import { FaRegCircleXmark } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'
import Loader from '../../Loaders/Loader'
import { formatStatus } from '../../utils/formatStatus'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';


const ReviewRequests = () => {
  const [VolunteerRequests,setVolunteerRequests] = useState([]);
  const [StatusUpdateRequests,setStatusUpdateRequests] = useState([]);
  const [volunteerPage,setVolunteerPage] = useState(1);
  const [statusUpdatePage,setStatusUpdatePage] = useState(1);
  const [volunteerLimit,setVolunteerLimit] = useState(5);
  const [statusUpdateLimit,setStatusUpdateLimit] = useState(5);
  const [volunteerTotalPages,setVolunteerTotalPages] = useState(1);
  const [statusUpdateTotalPages,setStatusUpdateTotalPages] = useState(1);
  const [loading,setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRequestType, setSelectedRequestType] = useState(null);


  const navigate = useNavigate();

  const fetchRequests = async()=>{
    try {
      setLoading(true);
      const volunteerResponse = await axios.get(`/admin/volunteerrequests?page=${volunteerPage}&limit=${volunteerLimit}`);
      const statusUpdateResponse = await axios.get(`/admin/statusupdaterequests?page=${statusUpdatePage}&limit=${statusUpdateLimit}`);
      setVolunteerRequests(volunteerResponse.data.requests);
      setStatusUpdateRequests(statusUpdateResponse.data.requests);
      setVolunteerTotalPages(volunteerResponse.data.totalPages);
      setStatusUpdateTotalPages(statusUpdateResponse.data.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch requests");
    }finally{
      setLoading(false);
    }
  }



  useEffect(() => {
    fetchRequests();
  }, [volunteerPage,statusUpdatePage,volunteerLimit,statusUpdateLimit]);

  const reviewVolunteerRequest = async(requestId,review)=>{
    try {
      const response = await axios.put(`/admin/review/volunteerrequest/${requestId}`,{status:review});
      if(response.status === 200){
        toast.success("Request reviewed successfully");
        fetchRequests();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to review request");
    }finally{
      setLoading(false);
    }
  }

  const reviewStatusUpdateRequest = async(requestId,review)=>{
    try {
      const response = await axios.put(`/admin/review/statusupdaterequest/${requestId}`,{status:review});
      if(response.status === 200){
        toast.success("Request reviewed successfully");
        fetchRequests();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to review request");
    }finally{
      setLoading(false);
    }
  }

  const confirmVolunteerRequest = (event,requestId,review) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => reviewVolunteerRequest(requestId,review),
            reject: () => ()=>{}
        });
    };

  const confirmStatusUpdateRequest = (event,requestId,review) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: () => reviewStatusUpdateRequest(requestId,review),
            reject: () => ()=>{}
        });
    };

  if(loading){
    return <div className='flex justify-center items-center h-[calc(100vh-10rem)]'><Loader/></div>
  }

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold'>Review Requests</h1>
          <p className='text-gray-700'>View and manage all requests</p>
        </div>
      </div>
      <div className='mt-10'>
        <TabGroup>
          <TabList className="flex space-x-4 inline-flex items-center rounded-xl transition-all duration-300 ">
              <Tab  className="rounded-full px-3 py-1 text-sm/6 font-semibold text-green-700 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-green-700 data-hover:bg-green-700/5 data-selected:bg-green-700 data-selected:data-hover:bg-green-700 data-selected:data-hover:text-white data-selected:text-white cursor-pointer transition-all duration-300 flex items-center gap-2"><MdOutlineVolunteerActivism/><span>Volunteer Requests</span></Tab>
              <Tab className="rounded-full px-3 py-1 text-sm/6 font-semibold text-green-700 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-green-700 data-hover:bg-green-700/5 data-selected:bg-green-700 data-selected:data-hover:bg-green-700 data-selected:data-hover:text-white data-selected:text-white cursor-pointer transition-all duration-300 flex items-center gap-2"><RxUpdate/><span>Status Update Requests</span></Tab>
          </TabList>
          <TabPanels className="mt-4">
              <TabPanel className="p-4 flex flex-col gap-3">
                {VolunteerRequests.map((request,index)=>(
                  <div key={index} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between hover:shadow-xl transition-all duration-300 ease-in-out">
                    <div className='flex flex-col gap-3'>
                      <div className='flex flex-col gap-2'>
                          <h2 className="text-lg font-semibold capitalize">{request.note}</h2>
                          <p className="text-sm text-gray-600 hover:underline cursor-pointer" onClick={()=>navigate(`/issues/${request.report._id}`)}>{request.report.title}</p>
                      </div>
                      <div className='flex items-center gap-10'>
                        <div className="flex items-center gap-2">
                          <p className='text-gray-700 text-sm capitalize'>Requested By:</p>
                          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-full" onClick={()=>navigate(`/profile/${request.volunteer._id}`)}>
                            <img src={request.volunteer.profile_image} alt="" className="w-5 h-5 rounded-full" />
                            <p className='text-gray-700 text-sm capitalize'>{request.volunteer.username}</p>
                          </div>
                          <div>
                            <LuDot />
                          </div>
                          <div>
                            <p className='text-gray-700 text-sm capitalize'>{formatDateTime(request.requestedAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {
                            request.reviewedBy ? (
                              <>
                              <p className='text-gray-700 text-sm capitalize'>Reviewed By:</p>
                              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-full" onClick={()=>navigate(`/profile/${request.reviewedBy?._id}`)}>
                                <img src={request.reviewedBy?.profile_image} alt="" className="w-5 h-5 rounded-full" />
                                <p className='text-gray-700 text-sm capitalize'>{request.reviewedBy?.username}</p>
                              </div>
                              <div>
                                <LuDot />
                              </div>
                              <div>
                                <p className='text-gray-700 text-sm capitalize'>{formatDateTime(request.reviewedAt)}</p>
                              </div>
                              </>
                            ) : (
                              <>
                              <p className='text-gray-700 text-sm capitalize'>Not Reviewed Yet</p>
                              </>
                            )
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      {
                        request.status === "pending" ? (
                          <>
                            <ConfirmPopup />
                            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-32 hover:bg-emerald-700 transition-all duration-300 cursor-pointer"
                            onClick={(e)=>confirmVolunteerRequest(e,request._id,"approved")}
                            >
                              <SiTicktick/>
                              <p>Approve</p>
                            </button>
                            <button className="border border-red-700 text-red-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-32 hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer"
                            onClick={(e)=>confirmVolunteerRequest(e,request._id,"rejected")}
                            >
                              <FaRegCircleXmark/>
                              <p>Reject</p>
                            </button>
                          </>
                        ) : (
                          <p className={`text-sm ${request.status === "approved" ? "text-green-700" : "text-red-700"} capitalize flex items-center gap-2`}>
                            {
                              request.status === "approved" ? (
                                <SiTicktick/>
                              ) : request.status === "rejected" ? (
                                <FaRegCircleXmark/>
                              ) : (
                                <GiReturnArrow/>
                              )
                            }
                            <span className='italic'>{request.status}</span>
                          </p>
                        )
                      }
                    </div>
                  </div>
                ))}
                  <div className='flex justify-between items-center mt-5'>
                    <div >
                      <p>Page {volunteerPage} of {volunteerTotalPages}</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <button onClick={()=>setVolunteerPage(volunteerPage-1)} disabled={volunteerPage===1} className='p-2 rounded-full hover:bg-gray-200 transition duration-300 ease-in-out disabled:opacity-50 hover:cursor-pointer'><MdKeyboardArrowLeft /></button>
                      {
                        Array.from({length:volunteerTotalPages},(_,i)=>(
                          <button key={i} onClick={()=>setVolunteerPage(i+1)} className={`p-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition duration-300 ease-in-out hover:cursor-pointer ${volunteerPage===i+1 ? "bg-green-100/90 text-green-700" : ""}`} disabled={volunteerPage===i+1}>
                            {i+1}
                          </button>
                        ))
                      }
                      <button onClick={()=>setVolunteerPage(volunteerPage+1)} disabled={volunteerPage===volunteerTotalPages} className='p-2 rounded-full hover:bg-gray-200 transition duration-300 ease-in-out disabled:opacity-50 hover:cursor-pointer'><MdKeyboardArrowRight /></button>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <p>Rows per page</p>
                      <Dropdown value={volunteerLimit} options={[2,5,10,15,20]} onChange={(e)=>setVolunteerLimit(e.value)} />
                    </div>
                  </div>
              </TabPanel>
              <TabPanel className="p-4 flex flex-col gap-3">
                {StatusUpdateRequests.map((request,index)=>(
                  <div key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out flex justify-between items-center">
                    <div className='flex flex-col gap-3'>
                      <div className='flex flex-col gap-2'>
                          <h2 className="text-lg font-semibold">{request.report.title}</h2>
                          <p className="text-sm text-gray-600 hover:underline cursor-pointer" onClick={()=>navigate(`/issues/${request.report._id}`)}>{request.report.title}</p>
                      </div>
                      <div className='flex items-center gap-2 font-bold'>
                        <p className='text-gray-700 text-sm capitalize'>Requested Status:</p>
                        <p className='text-gray-700 text-sm capitalize'>{formatStatus(request.requestedStatus)}</p>
                      </div>
                      <div className='flex items-center gap-2 flex-wrap'>
                        {
                          request.images.length > 0 ? (
                            <div className='flex items-center gap-2'>
                              {
                                request.images.map((image,index)=>(
                                  <img key={index} src={image.url} alt="" className="w-16 h-16 object-cover" />
                                ))
                              }
                            </div>
                          ) : null
                        }
                      </div>
                      <div className='flex items-center gap-10'>
                        <div className="flex items-center gap-2">
                          <p className='text-gray-700 text-sm capitalize'>Requested By:</p>
                          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-full" onClick={()=>navigate(`/profile/${request.requestedBy._id}`)}>
                            <img src={request.requestedBy.profile_image} alt="" className="w-5 h-5 rounded-full" />
                            <p className='text-gray-700 text-sm capitalize'>{request.requestedBy.username}</p>
                          </div>
                          <div>
                            <LuDot />
                          </div>
                          <div>
                            <p className='text-gray-700 text-sm capitalize'>{formatDateTime(request.requestedAt)}</p>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {
                              request.reviewedBy ? (
                                <>
                                  <p className='text-gray-700 text-sm capitalize'>Reviewed By:</p>
                                  <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded-full" onClick={()=>navigate(`/profile/${request.reviewedBy._id}`)}>
                                    <img src={request.reviewedBy.profile_image} alt="" className="w-5 h-5 rounded-full" />
                                    <p className='text-gray-700 text-sm capitalize'>{request.reviewedBy.username}</p>
                                  </div>
                                  <div>
                                    <LuDot />
                                  </div>
                                  <div>
                                    <p className='text-gray-700 text-sm capitalize'>{formatDateTime(request.requestedAt)}</p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p className='text-gray-700 text-sm capitalize'>Not Reviewed Yet</p>
                                </>
                              )
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      {
                        request.status === "pending" ? (
                          <>
                            <ConfirmPopup />
                            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-32 hover:bg-emerald-700 transition-all duration-300 cursor-pointer"
                            onClick={(e)=>confirmStatusUpdateRequest(e,request._id,"approved")}
                            >
                              <SiTicktick/>
                              <span>Approve</span>
                            </button>
                            <button className="border border-red-600 text-red-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-32 hover:bg-red-700 hover:text-white transition-all duration-300 cursor-pointer"
                            onClick={(e)=>confirmStatusUpdateRequest(e,request._id,"rejected")}
                            >
                              <FaRegCircleXmark/>
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          <p className={`text-sm ${request.status === "approved" ? "text-green-700" : "text-red-700"} capitalize flex items-center gap-2`}>
                            {
                              request.status === "approved" ? (
                                <SiTicktick/>
                              ) : request.status === "rejected" ? (
                                <FaRegCircleXmark/>
                              ) : (
                                <GiReturnArrow/>
                              )
                            }
                            <span className='italic'>{request.status}</span>
                          </p>
                        )
                      }
                    </div>
                  </div>
                ))}
                <div className='flex justify-between items-center mt-5'>
                  <div >
                    <p>Page {statusUpdatePage} of {statusUpdateTotalPages}</p>
                  </div>
                  <div className='flex gap-3 items-center'>
                    <button onClick={()=>setStatusUpdatePage(statusUpdatePage-1)} disabled={statusUpdatePage===1} className='p-2 rounded-full hover:bg-gray-200 transition duration-300 ease-in-out disabled:opacity-50 hover:cursor-pointer'><MdKeyboardArrowLeft /></button>
                    {
                      Array.from({length:statusUpdateTotalPages},(_,i)=>(
                        <button key={i} onClick={()=>setStatusUpdatePage(i+1)} className={`p-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition duration-300 ease-in-out hover:cursor-pointer ${statusUpdatePage===i+1 ? "bg-green-100/90 text-green-700" : ""}`} disabled={statusUpdatePage===i+1}>
                          {i+1}
                        </button>
                      ))
                    }
                    <button onClick={()=>setStatusUpdatePage(statusUpdatePage+1)} disabled={statusUpdatePage===statusUpdateTotalPages} className='p-2 rounded-full hover:bg-gray-200 transition duration-300 ease-in-out disabled:opacity-50 hover:cursor-pointer'><MdKeyboardArrowRight /></button>
                  </div>
                  <div className='flex gap-3 items-center'>
                    <p>Rows per page</p>
                    <Dropdown value={statusUpdateLimit} options={[2,5,10,15,20]} onChange={(e)=>setStatusUpdateLimit(e.value)} />
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
      </div>
    </div>
  )
}

export default ReviewRequests