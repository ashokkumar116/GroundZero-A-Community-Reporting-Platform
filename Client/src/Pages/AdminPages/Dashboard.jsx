import React from 'react'
import SummaryCard from '../../Components/Cards/SummaryCard'
import { FaUsers, } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { SiTicktick } from "react-icons/si";
import { FaRegClock } from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";
import { FaRegHandshake } from "react-icons/fa";
import { AgCharts } from 'ag-charts-react';
import { useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from '../../Services/axios';
import Loader from '../../Loaders/Loader';
import { FaRegCircleXmark } from "react-icons/fa6";
import { timeAgo } from '../../utils/timeAgo';

const Dashboard = () => {

  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const [summary,setSummary] = useState({});
  const [dataByMonth,setdataByMonth] = useState([]);
  const [reportsBySeverity,setReportsBySeverity] = useState([]);
  const [recentReports,setRecentReports] = useState([]);

  const timeNow = new Date().getTime();

  const fetchDashboardDatas = async()=>{
    try {
      setLoading(true);
      const summaryResponse = await axios.get("/admin/dashboard/summary");
      const chartResponse = await axios.get("/admin/dashboard/charts");
      const recentReportsResponse = await axios.get("/admin/dashboard/recentreports");
      setSummary(summaryResponse.data);
      setdataByMonth(chartResponse.data.reportsByMonth);
      setReportsBySeverity(chartResponse.data.reportsBySeverity);
      setRecentReports(recentReportsResponse.data.recentReports);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch dashboard datas");
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
  setChartOptions(prev => ({
    ...prev,
    data: dataByMonth,
  }));

  setChartOptions2(prev => ({
    ...prev,
    data: reportsBySeverity,
  }));
}, [dataByMonth, reportsBySeverity]);

  const [chartOptions, setChartOptions] = useState({
        data:dataByMonth,
        title: {
              text: "Reports Overview",
            },
        subtitle: {
              text: "Monthly report submissions",
            },
        series: [{ type: 'bar', xKey: 'month', yKey: 'count' }],
    });

    const [chartOptions2, setChartOptions2] = useState({
        data: reportsBySeverity,
        title: {
              text: "Status Distribution",
            },
        subtitle: {
              text: "Current report statuses",
            },
        series: [
                  {
                    type: "donut",
                    calloutLabelKey: "status",
                    angleKey: "count",
                    fills: [
                      "#facc15", // in-progress - yellow
                      "#22c55e", // resolved - green
                      "#ef4444", // pending - red
                    ],
                  },
                ],
      });

    useEffect(()=>{
        fetchDashboardDatas();
    },[])

    useEffect(()=>{
        console.log(summary);
    },[summary])

    useEffect(()=>{
        console.log(reportsBySeverity);
        console.log(dataByMonth);

    },[reportsBySeverity,dataByMonth])

    if(loading){
        return <div className='w-full h-[calc(100vh-10rem)] flex justify-center items-center'>
            <Loader/>
        </div>
    }

  return (
    <div className='w-full'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold'>Dashboard</h1>
            <p className='text-gray-700'>Welcome back! Here's what's happening today.</p>
          </div>
        </div>
        <div className='flex justify-between items-center gap-5 mt-5'>
          <div className='flex flex-col gap-2 bg-white p-5 rounded-lg hover:shadow-md transition-all cursor-pointer'>
            <div>
              <h1 className='text-base font-semibold'>Users Summary</h1>
            </div>
            <SummaryCard title="Total Users" icon={FaUsers} data={summary?.totalUsers} backgroundColor="bg-emerald-500/10" iconColor="text-emerald-500"/>
          </div>
          <div className='flex flex-col gap-2 bg-white p-5 rounded-lg hover:shadow-md transition-all cursor-pointer'>
            <div>
              <h1 className='text-base font-semibold'>Reports Summary</h1>
            </div>
            <div className='flex flex-wrap gap-4'>
              <SummaryCard title="Total Reports" icon={FaRegFileLines} data={summary?.reports?.totalReports} backgroundColor="bg-blue-500/10" iconColor="text-blue-500"/>
              <SummaryCard title="Resolved Reports" icon={SiTicktick} data={summary?.reports?.resolvedReports} backgroundColor="bg-green-500/10" iconColor="text-green-500"/>
              <SummaryCard title="In Progress Reports" icon={FaRegClock} data={summary?.reports?.inProgressReports} backgroundColor="bg-yellow-500/10" iconColor="text-yellow-500"/>
              <SummaryCard title="Pending Reports" icon={MdOutlineReportProblem} data={summary?.reports?.pendingReports} backgroundColor="bg-red-500/10" iconColor="text-red-500"/>
            </div>
          </div>
        </div>
        <div className='flex justify-between items-center gap-5 mt-5 w-full'>
          <div className='flex flex-col gap-2 bg-white p-5 rounded-lg hover:shadow-md transition-all cursor-pointer flex-1'>
            <div>
              <h1 className='text-base font-semibold'>Requests Summary</h1>
            </div>
            <div className='flex flex-col gap-4'>
              <div>
                <h1 className='text-sm font-medium'>Volunteer Requests</h1>
              </div>
              <div className='flex flex-wrap gap-2 justify-around'>
              <SummaryCard title="Total" icon={FaRegHandshake} data={summary?.volunteerRequests?.totalVolunteerRequests} backgroundColor="bg-blue-500/10" iconColor="text-blue-500"/>
              <SummaryCard title="Approved" icon={SiTicktick} data={summary?.volunteerRequests?.totalApprovedVolunteerRequests} backgroundColor="bg-green-500/10" iconColor="text-green-500"/>
              <SummaryCard title="Pending" icon={FaRegClock} data={summary?.volunteerRequests?.totalPendingVolunteerRequests} backgroundColor="bg-yellow-500/10" iconColor="text-yellow-500"/> 
              <SummaryCard title="Rejected" icon={FaRegCircleXmark} data={summary?.volunteerRequests?.totalRejectedVolunteerRequests} backgroundColor="bg-red-500/10" iconColor="text-red-500"/>
              <SummaryCard title="Withdrawn" icon={FaRegClock} data={summary?.volunteerRequests?.totalWithdrawnVolunteerRequests} backgroundColor="bg-red-500/10" iconColor="text-red-500"/>
            </div>
            </div>
            <div className='flex flex-col gap-4 mt-2'>
              <div>
                <h1 className='text-sm font-medium'>Status Update Requests</h1>
              </div>
              <div className='flex flex-wrap gap-4 justify-around'>
              <SummaryCard title="Total" icon={FaRegHandshake} data={summary?.statusUpdateRequests?.totalStatusUpdateRequests} backgroundColor="bg-blue-500/10" iconColor="text-blue-500" className="flex-1"/>
              <SummaryCard title="Approved" icon={SiTicktick} data={summary?.statusUpdateRequests?.totalApprovedStatusUpdateRequests} backgroundColor="bg-green-500/10" iconColor="text-green-500" className="flex-1"/>
              <SummaryCard title="Pending" icon={FaRegClock} data={summary?.statusUpdateRequests?.totalPendingStatusUpdateRequests} backgroundColor="bg-yellow-500/10" iconColor="text-yellow-500" className="flex-1"/> 
              <SummaryCard title="Rejected" icon={FaRegCircleXmark} data={summary?.statusUpdateRequests?.totalRejectedStatusUpdateRequests} backgroundColor="bg-red-500/10" iconColor="text-red-500" className="flex-1"/>
            </div>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-5 mt-5 w-full'>
          <div className='flex-2'>
            <AgCharts options={chartOptions} className='flex-1'/>
          </div>
          <div className='flex-1'>
            <AgCharts options={chartOptions2} className='flex-1'/>
          </div>
        </div>
        <div className='flex flex-col gap-2 mt-5'>
          <div className='flex items-center justify-between gap-2'>
            <div>
              <h1 className='text-base font-semibold'>Recent Reports</h1>
              <p className='text-sm text-gray-500'>Latest reports submitted by users</p>
            </div>
            <button className='text-green-600 hover:underline hover:underline-offset-2 hover:text-green-800 cursor-pointer transition-all duration-300 ease-in-out'
            onClick={()=>navigate('/admin/reports')}>
              <p>View All</p>
            </button>
          </div>
          <div className='flex flex-col gap-5 p-5 bg-white rounded-lg hover:shadow-md transition-all cursor-pointer'>
            {
              recentReports?.map((report)=>{
                return (
                  <div className='flex items-center gap-3'>
                    <img src={report.reportedBy?.profile_image} alt="icon" className='w-10 h-10 rounded-full' />
                    <div className='flex flex-col gap-2'>
                      <h1 className='text-sm font-semibold'>{report.reportedBy?.username} <span className='font-normal'>posted</span> <span className='font-semibold'>{report.title}</span></h1>
                      <div className='flex items-center gap-2'>
                        <p className='text-xs text-green-700 py-1 bg-green-700/10 rounded-xl text-center inline-flex items-center px-2'>{report?.category}</p>
                        <p className='text-xs text-gray-500'>{timeAgo(report?.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
    </div>
  )
}

export default Dashboard