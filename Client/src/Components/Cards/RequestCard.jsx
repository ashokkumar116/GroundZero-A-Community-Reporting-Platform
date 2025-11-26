import React, { useState } from 'react'
import { useAuthStore } from '../../lib/authStore';
import { formatDate } from '../../utils/formatDate';
import { Tag } from 'primereact/tag';
import { formatStatus } from '../../utils/formatStatus';
import { IoTimeOutline } from "react-icons/io5";
import { PiHandWithdraw } from "react-icons/pi";
import { SiTicktick } from "react-icons/si";
import { FaRegCircleXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from '../../Services/axios';
import toast from 'react-hot-toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const RequestCard = ({request,fetchRequests,isStatusUpdateRequest}) => {
    const {user} = useAuthStore();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);

    const confirm = () => {
        confirmDialog({
            message: 'Are you sure you want to withdraw this request?',
            header: 'Withdraw Request',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => handleWithdrawRequest(),
            reject: () => {},
        });
    }

    const handleWithdrawRequest = async()=>{
        try {
            setLoading(true);
            const response = await axios.put(`/request/withdrawrequest/${request._id}`);
            if(response.status === 200){
                fetchRequests();
                toast.success("Request Withdrawn Successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }finally{
            setLoading(false);
        }
    }

  return (
    <div className='p-5 border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg cursor-pointer hover:border-green-500/60 hover:bg-green-50/50 transition-all duration-300'>
        <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2' onClick={()=>navigate(`/profile/${user?._id}`)}>
                <div>
                    <img src={user?.profile_image} alt="" className='h-10 w-10 rounded-full' />
                </div>
                <div>
                    <p className='font-semibold capitalize'>{user?.username}</p>
                    <p className='text-sm text-gray-500'>Requested on {formatDate(request.requestedAt)}</p>
                </div>
            </div>
            <div>
                <Tag value={request.status}  severity={request.status === "pending" ? "warning" : request.status === "approved" ? "success" : "danger"}  className='capitalize' />
            </div>
        </div>
        <div className='px-2 py-3 mt-2'>
            <p className='text-sm text-gray-500'>"{request?.note}"</p>
        </div>
        <div className='p-2 border border-gray-200 bg-gray-50 mt-3 flex flex-col gap-2' onClick={()=>navigate(`/issues/${request?.report?._id}`)}>
            <div className='flex items-center gap-2'>
                <div className='flex-1'>
                    <p className='text-sm font-semibold line-clamp-2 capitalize'>{request?.report?.title}</p>
                </div>
                <div className=''>
                    <Tag value={formatStatus(request?.report?.status)} severity={request?.report?.status === "in_progress" ? "warning" : request?.report?.status === "resolved" ? "success" : "danger"} className='capitalize' />
                </div>
            </div>
            <div>
                <div className='text-xs text-gray-500 line-clamp-2' 
                    dangerouslySetInnerHTML={{__html:request?.report?.description}}
                />
            </div>
        </div>
        <div className='flex items-center justify-between px-2 py-3'>
            <div>
                <p className='text-sm text-gray-500'>Requested At</p>
                <p className='text-xs'>{formatDate(request.requestedAt)}</p>
            </div>
            <div>
                <p className='text-sm text-gray-500'>Reviewed At</p>
                <p className='text-xs'>{request.reviewedAt ? formatDate(request.reviewedAt) : "Not Reviewed Yet"}</p>
            </div>
        </div>
        {
            request?.requestedStatus && (
                <div className='px-2 py-3'>
                    <p className='text-sm text-gray-500'>Requested Status</p>
                    <p className='text-xs capitalize'>{formatStatus(request?.requestedStatus)}</p>
                </div>
            )
        }
        <div className='flex items-center gap-2 mt-3 cursor-pointer' onClick={()=>navigate(`/profile/${request?.reviewedBy?._id}`)}>
            {request?.reviewedBy && (
                <>
                    <div className=''>
                        <img src={request?.reviewedBy?.profile_image} alt="" className='h-10 w-10 rounded-full' />
                    </div>
                    <div>
                        <p className='text-xs text-gray-500'>Reviewed By</p>
                        <p className='text-sm font-semibold'>{request?.reviewedBy?.username}</p>
                    </div>
                </>
            )}
            {!request?.reviewedBy && (
                <p className='text-xs text-gray-500 flex items-center gap-2 py-3'><IoTimeOutline /> <span>Awaiting Admin Approval</span></p>
            )}
        </div>
        <hr className='mt-3 text-gray-500' />
        <div className='flex items-center justify-center mt-3'>
            {
                (request?.status === "approved") ? (
                    <div>
                        <p className='text-green-500 flex items-center gap-2'><SiTicktick className='text-green-500' /><span>Request Approved</span></p>
                    </div>
                ) : (request?.status === "rejected") ? (
                    <div>
                        <p className='text-red-500 flex items-center gap-2'><FaRegCircleXmark className='text-red-500' /><span>Request Rejected</span></p>
                    </div>
                ) : (request?.status === "withdrawn") ? (
                    <div>
                        <p className='text-red-500 flex items-center gap-2'><FaRegCircleXmark className='text-red-500' /><span>Request Withdrawn</span></p>
                    </div>
                ) : (
                    <div>
                        {
                            isStatusUpdateRequest ? (
                                <p className='text-red-500 flex items-center gap-2'><FaRegCircleXmark className='text-red-500' /><span>Cannot Withdraw Status Update Request</span></p>
                            ) : (
                                loading ? (
                                <button className='bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed' disabled={loading}>
                                    <span className='loading loading-sm'></span>
                                    <p>Withdrawing...</p>
                                </button>
                            ):(
                                <button className='bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center gap-2 cursor-pointer'
                                    onClick={confirm}
                                >
                                    <PiHandWithdraw />
                                    <p>Withdraw Request</p>
                                </button>
                            )
                            )
                        }
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default RequestCard