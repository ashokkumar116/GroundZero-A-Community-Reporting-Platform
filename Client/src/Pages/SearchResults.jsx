import axios from '../Services/axios';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../lib/authStore';
import IssuesCard from '../Components/Cards/IssuesCard';
import Back from '../Components/Buttons/Back';
import CardSkeleton from '../Skeletons/CardSkeleton';

const SearchResults = () => {
    const searchQuery = useLocation().search;
    const searchParams = new URLSearchParams(searchQuery);
    const search = searchParams.get('search');
    console.log(search);

    const [scrolled,setScrolled] = useState(false);
    const handleScroll = () => {
        if(window.scrollY > 0){
            setScrolled(true);
        }else{
            setScrolled(false);
        }
    }
    window.addEventListener('scroll',handleScroll);    
    const [page,setPage] = useState(1);
    const [hasMore,setHasMore] = useState(true);
    const [reports,setReports] = useState([]);
    const [loading,setLoading] = useState(false);

    const {user} = useAuthStore();

    const observerRef = useRef(null);

    const fetchReports = async(pageNumber)=>{
        try {
            setLoading(true);
            const res = await axios.get(`/reports/search?search=${search}&page=${pageNumber}&limit=5`);
        
            const newReports = res.data.reports;

            setReports((prev) => {
                const prevIds = new Set(prev.map((r) => r._id));
                const merged = [
                    ...prev,
                    ...newReports.filter((r) => !prevIds.has(r._id)),
                ];
                return merged;
        });

            setHasMore(pageNumber < res.data.totalPages);
            
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch reports");
            
        }finally{
            setLoading(false);
        }
    }

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
        }
    ,
    [hasMore,loading]
    )

    useEffect(()=>{
        fetchReports(page);
    },[page])


    if(loading){
        return <div className="pt-30 px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </div>
    }


  return (
    <div className='px-20 py-30'>
        <Back scrolled={scrolled} />
        <div className='my-5'>
            <h1 className='text-2xl font-bold text-green-700'>Search Results for "{search}"</h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {
                reports.length > 0 ? (
                    reports.map((report,index)=>(
                        <IssuesCard 
                            key={index}
                            report={report}
                            isLast={index === reports.length - 1}
                            userId={user._id}
                            lastItemRef={lastItemRef}
                        />
                    ))
                ) : (
                    <p>No reports found</p>
                )
            }
        </div>  
    </div>
  )
}

export default SearchResults