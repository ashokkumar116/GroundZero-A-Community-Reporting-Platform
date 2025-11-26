import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import Loader from '../Loaders/Loader';
import axios from '../Services/axios';
import IssuesCard from '../Components/Cards/IssuesCard';
import { useAuthStore } from '../lib/authStore';
import { IoBanOutline } from "react-icons/io5";
import VolunteerWorksCard from '../Components/Cards/VolunteerWorksCard';

const VolunteerWorks = () => {
    const userId = useAuthStore((state)=>state.user._id);
    const {id} = useParams();
    const [volunteerWorks, setVolunteerWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page,setPage] = useState(1);
    const [hasMore,setHasMore] = useState(true);
    const observerRef = useRef();

    useEffect(() => {
        const fetchVolunteerWorks = async () => {
            setLoading(true);   
            const response = await axios.get(`/users/volunteer-works/${id}?page=${page}&limit=5`);
            const newVolunteerWorks = response.data.volunteerWorks;
            setVolunteerWorks((prev)=>{
                    const prevIds = new Set(prev.map((vw)=>vw._id));
                    const merged = [...prev,...newVolunteerWorks.filter((vw)=>!prevIds.has(vw._id))];
                    return merged;
                });
                setHasMore(page<response.data.totalPages);
                setLoading(false);
        };
        fetchVolunteerWorks();
    }, [id,page]);

    useEffect(()=>{
        console.log(volunteerWorks);
    },[volunteerWorks])

    const lastItemRef = useCallback(
        node=>{
            if(loading){
                return
            }
            if(observerRef.current){
                observerRef.current.disconnect();
            }
            if(!node){
                return
            }
            observerRef.current = new IntersectionObserver(entries=>{
                const entry = entries[0];
                if(entry.isIntersecting && hasMore && !loading){
                    setPage((prev)=>prev+1);
                }
            })
            observerRef.current.observe(node);
        },
        [loading,hasMore]
    )

    if(loading){
        return <div className='flex flex-col items-center justify-center h-screen'><Loader /></div>
    }

  return (
    <div
        className='px-20 py-30'
    >
        <div>
            <div>
                <h1 className='text-2xl text-green-800 font-bold'>Volunteer Works</h1>
                <p className='text-gray-600'>Your contribution is shaping a better community.</p>
            </div>
            <div>
                <div className='mt-5'>
                    {
                        volunteerWorks.length === 0 ? (
                            <div className='flex flex-col items-center justify-center h-full'>
                                <IoBanOutline className='text-6xl text-gray-400' />
                                <p className='text-gray-600'>No volunteer works found</p>
                            </div>
                        ) : (
                            volunteerWorks.map((volunteerWork,index) => (
                                <div
                                    key={volunteerWork._id}
                                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                                >
                                    <VolunteerWorksCard report={volunteerWork} userId={userId} lastItemRef={lastItemRef} isLast={index === volunteerWorks.length - 1} />
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default VolunteerWorks