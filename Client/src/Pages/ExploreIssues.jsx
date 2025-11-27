import axios from "../Services/axios";
import React from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import IssuesCard from "../Components/Cards/IssuesCard";
import CardSkeleton from "../Skeletons/CardSkeleton";
import { useAuthStore } from "../lib/authStore";
import FilterPanel from "../Components/Panels/FilterPanel";
import toast from "react-hot-toast";

const ExploreIssues = () => {
    const [reports, setReports] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedPriority, setSelectedPriority] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [search,setSearch] = useState("");

    const {user} = useAuthStore();

    const observerRef = useRef();

    const fetchReports = async (pageNumber) => {
        setLoading(true);
        const res = await axios.get(
            `/reports/fetchreports?page=${pageNumber}&limit=5`
        );
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
        setLoading(false);
    };

    const fetchReportsByFilter = async(pageNumber = 1)=>{
        try {
            setLoading(true)
            const response = await axios.get(`/reports/filter`,{
                params:{
                    page:pageNumber,
                    limit:5,
                    category:selectedCategory.length > 0 ? selectedCategory.join(',') : "",
                    status:selectedStatus.length > 0 ? selectedStatus.join(',') : "",
                    priority : selectedPriority.length > 0 ? selectedPriority.join(',') : ""
                }
            })

            const newReports = response.data.reports

            if(pageNumber === 1 ){
                setReports(newReports)
            } else{
                setReports((prev) => {
                    const prevIds = new Set(prev.map((r) => r._id));
                    return [
                        ...prev,
                        ...newReports.filter((r) => !prevIds.has(r._id)),
                    ];
                });
            }
            setHasMore(pageNumber < response.data.totalPages);

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message);
        }finally{
            setLoading(false)
        }
    }

    const lastItemRef = useCallback(
        (node) => {
            if (loading) {
                return;
            }
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
            if (!node) return;

            observerRef.current = new IntersectionObserver((entries) => {
                const entry = entries[0];
                if (entry.isIntersecting && hasMore && !loading) {
                    setPage((prev) => prev + 1);
                }
            });
            observerRef.current.observe(node);
        },
        [loading, hasMore]
    );

    const clearFilter = ()=>{
        setSelectedCategory([])
        setSelectedPriority([])
        setSelectedStatus([])
        fetchReports(1)
    }



    useEffect(()=>{
        if(selectedCategory.length > 0 || selectedPriority.length > 0 || selectedStatus.length > 0 ){
            fetchReportsByFilter(page)
        }
        else{
            fetchReports(page)
        }
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
        <div className="pt-30 px-20">
            <FilterPanel 
                selectedCategory={selectedCategory}
                selectedPriority={selectedPriority}
                selectedStatus={selectedStatus}
                setSelectedCategory={setSelectedCategory}
                setSelectedPriority={setSelectedPriority}
                setSelectedStatus={setSelectedStatus}
                fetchReportsByFilter={fetchReportsByFilter}
                setReports={setReports}
                setPage={setPage}
                clearFilter={clearFilter}
                setSearch={setSearch}
                search={search}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                {reports.length > 0 ? (
                    reports.map((report, index) => {
                        const isLast = index === reports.length - 1;
                        return (
                            <IssuesCard
                                isLast={isLast}
                                report={report}
                                lastItemRef={lastItemRef}
                                key={report._id}
                                userId={user?._id}
                            />
                        );
                    })
                ) : (
                    <p className="text-gray-600">No Posts Found</p>
                )}
            </div>
        </div>
    );
};

export default ExploreIssues;
