import React from 'react'
import { useAuthStore } from '../lib/authStore';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import axios from '../Services/axios';
import { useParams } from 'react-router-dom';
import CardSkeleton from '../Skeletons/CardSkeleton';
import IssuesCard from '../Components/Cards/IssuesCard';

const UserReports = () => {
    const userId = useParams().id;
    const [loading,setLoading] = useState(false);
    const {user} = useAuthStore();
    const [reports,setReports] = useState([]);

    const fetchReports = async()=>{
        try {
            setLoading(true);
            const response = await axios.get(`/users/user-reports/${userId}`);
            setReports(response?.data?.userReports);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch reports");
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchReports();
    },[userId]);

    useEffect(()=>{
        console.log(reports);
    },[reports])

    if(loading){
            return <div className="pt-30 px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
    }

  return (
    <div
        className='px-20 py-30'
    >
        <h1 className='text-2xl text-green-700 font-bold capitalize'>{reports?.[0]?.reportedBy?.username || "User"} Reports</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
            {
                reports?.length > 0 ? (
                    reports.map((report)=>{
                        return(
                            <IssuesCard
                                report={report}
                                key={report._id}
                                userId={user?._id}
                            />
                        )
                    })
                ) : (
                    <p>No Reports Found</p>
                )
            }
        </div>
    
    </div>
  )
}

export default UserReports