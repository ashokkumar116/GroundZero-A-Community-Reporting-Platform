import axios from "../Services/axios";
import React from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import IssuesCard from "../Components/Cards/IssuesCard";
import CardSkeleton from "../Skeletons/CardSkeleton";
import { useAuthStore } from "../lib/authStore";

const ExploreIssues = () => {
    const [reports, setReports] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        fetchReports(page);
    }, [page]);



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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
                    <p>No Post</p>
                )}
            </div>
        </div>
    );
};

export default ExploreIssues;
