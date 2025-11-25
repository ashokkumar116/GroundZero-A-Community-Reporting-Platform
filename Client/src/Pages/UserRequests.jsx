
import 'primereact/resources/themes/lara-light-green/theme.css';
import 'primereact/resources/primereact.min.css';
import { TabGroup, TabList, TabPanel, TabPanels, Tab } from '@headlessui/react'
import { useState } from 'react';
import axios from '../Services/axios';
import { useEffect } from 'react';
import RequestCard from '../Components/Cards/RequestCard';
import toast from 'react-hot-toast';
import Loader from '../Loaders/Loader';
import { MdOutlineVolunteerActivism } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";


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
                <TabList className="flex space-x-4 inline-flex items-center rounded-xl transition-all duration-300 ">
                    <Tab  className="rounded-full px-3 py-1 text-sm/6 font-semibold text-green-700 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-green-700 data-hover:bg-green-700/5 data-selected:bg-green-700 data-selected:data-hover:bg-green-700 data-selected:data-hover:text-white data-selected:text-white cursor-pointer transition-all duration-300 flex items-center gap-2"><MdOutlineVolunteerActivism/><span>Volunteer Requests</span></Tab>
                    <Tab className="rounded-full px-3 py-1 text-sm/6 font-semibold text-green-700 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-green-700 data-hover:bg-green-700/5 data-selected:bg-green-700 data-selected:data-hover:bg-green-700 data-selected:data-hover:text-white data-selected:text-white cursor-pointer transition-all duration-300 flex items-center gap-2"><RxUpdate/><span>Status Update Requests</span></Tab>
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