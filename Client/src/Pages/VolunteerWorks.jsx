import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Loader from '../Loaders/Loader';
import axios from '../Services/axios';
import IssuesCard from '../Components/Cards/IssuesCard';
import { useAuthStore } from '../lib/authStore';
import { IoBanOutline } from "react-icons/io5";

const VolunteerWorks = () => {
    const userId = useAuthStore((state)=>state.user._id);
    const {id} = useParams();
    const [volunteerWorks, setVolunteerWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchVolunteerWorks = async () => {
            try {
                setLoading(true);   
                const response = await axios.get(`/users/volunteer-works/${id}`);
                setVolunteerWorks(response.data.volunteerWorks);
            } catch (error) {
                console.error('Error fetching volunteer works:', error);
            }finally{
                setLoading(false);
            }
        };
        fetchVolunteerWorks();
    }, [id]);

    useEffect(()=>{
        console.log(volunteerWorks);
    },[volunteerWorks])

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
                            volunteerWorks.map((volunteerWork) => (
                                <div
                                    key={volunteerWork._id}
                                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                                >
                                    <IssuesCard report={volunteerWork} userId={userId} />
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