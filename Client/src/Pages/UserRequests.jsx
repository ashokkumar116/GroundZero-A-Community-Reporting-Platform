
import 'primereact/resources/themes/lara-light-green/theme.css';
import 'primereact/resources/primereact.min.css';
import { TabGroup, TabList, TabPanel, TabPanels, Tab } from '@headlessui/react'
import { useState } from 'react';
import axios from '../Services/axios';
import { useEffect } from 'react';
import RequestCard from '../Components/Cards/RequestCard';
import toast from 'react-hot-toast';
import CardSkeleton from '../Skeletons/CardSkeleton';
import Loader from '../Loaders/Loader';


const UserRequests = () => {

    const [volunteerRequests,setVolunteerRequests] = useState([]);
    const [statusUpdateRequests,setStatusUpdateRequests] = useState([]);
    const [loading,setLoading] = useState(false);

    const fetchRequests = async()=>{
        try {
            setLoading(true);
            const volunteerResponse = await axios.get('/users/user-volunteer-requests');
            const statusUpdateResponse = await axios.get('/users/user-status-update-requests');
        if(volunteerResponse.status === 200){
            setVolunteerRequests(volunteerResponse.data.requests);
        }
        if(statusUpdateResponse.status === 200){
            setStatusUpdateRequests(statusUpdateResponse.data.requests);
        }
            
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchRequests();
    },[])

    useEffect(()=>{
        console.log(volunteerRequests)
        console.log(statusUpdateRequests)
    },[volunteerRequests,statusUpdateRequests])

    if(loading){
        return <div className='flex items-center justify-center h-screen w-screen'>
                <Loader/>
        </div>
    }

  return (
    <div
        className='px-20 py-30'
    >
        <h1 className='text-3xl font-bold text-green-700 mb-5'>Your Requests</h1>
        <div>
            <TabGroup>
                <TabList className="flex space-x-4">
                    <Tab className="px-4 py-2 bg-green-700 text-white">Volunteer Requests</Tab>
                    <Tab className="px-4 py-2 bg-green-700 text-white">Status Update Requests</Tab>
                </TabList>
                <TabPanels className="mt-4">
                    <TabPanel className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {volunteerRequests.map((request,index)=>(
                <RequestCard 
                    key={index}
                    request={request}
                />
            ))} 
            </TabPanel>
            <TabPanel className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {statusUpdateRequests.map((request,index)=>(
                    <RequestCard 
                        key={index}
                        request={request}
                    />
                ))} 
            </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    </div>
  )
}

export default UserRequests