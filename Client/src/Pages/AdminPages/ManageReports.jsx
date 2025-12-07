import { Column } from 'primereact/column';
import axios from '../../Services/axios';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlusCircle } from 'react-icons/fi';
import { formatDate } from '../../utils/formatDate';
import { BsThreeDotsVertical } from 'react-icons/bs';
import PriorityBadge from '../../Components/Badge/PriorityBadge';
import StatusBadge from '../../Components/Badge/StatusBadge';
import { IoLocationOutline } from 'react-icons/io5';
import { Dropdown } from 'primereact/dropdown';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { OverlayPanel } from 'primereact/overlaypanel';
import ReportActionOverlay from '../../Components/Overlays/ReportActionOverlay';
import ReportEditModal from '../../Components/Modals/ReportEditModal';
import Loader from '../../Loaders/Loader';

const ManageReports = () => {
  const [search,setSearch] = useState('');
  const [reports,setReports] = useState([]);
  const [page,setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);
  const [limit,setLimit] = useState(5);
  const [searchMode,setSearchMode] = useState(false);
  const [searching,setSearching] = useState(false);
  const [selectedReport,setSelectedReport] = useState(null);
  const [modalVisible,setModalVisible] = useState(false);
  const [loading,setLoading] = useState(false);

  const op =useRef(null)

  const navigate = useNavigate();

  const getReports = async()=>{
    setLoading(true);
    try {
      if(searching){
        return;
      }
      const response = await axios.get('/admin/reports',{
        params:{
          page,
          limit
        }
      });
      setReports(response.data.reports);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch reports");
    }finally{
      setLoading(false);
    }
  }

  const searchReports = async(pageNumber=page)=>{
    setLoading(true);
    try {
      const response = await axios.get('/admin/searchreports',{
      params:{
        search,
        page:pageNumber,
        limit
      }
    });
    setReports(response.data.reports);
    setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch reports");
    }finally{
      setLoading(false);
    }
  }

  const handleSearch = () => {
    setPage(1);
    setSearching(true);
    setSearchMode(true);
    if(search.trim() === ''){
      setSearching(false);
      setSearchMode(false);
      getReports();
      return;
    }
    searchReports();
    setSearching(false);
  };

  useEffect(()=>{
    if(searchMode){
      searchReports();
    }else{
      getReports();
    }
  },[page,limit,searchMode])

  const titleBodyTemplate = (report) => {
    return (
      <div className='flex flex-col gap-2'>
        <p className='capitalize text-black font-semibold text-sm hover:underline transition cursor-pointer' onClick={()=>navigate(`/issues/${report._id}`)}>{report?.title?.title}</p>
        <div className='flex items-center gap-2'>
          <IoLocationOutline/>
          <p className='capitalize text-gray-600 text-xs'>{report?.title?.location?.village}, {report?.title?.location?.district}, {report?.title?.location?.state}</p>
        </div>
      </div>
    );
  };

  const categoryBodyTemplate = (report) => {
    return (
      <div className='bg-green-100/90 text-green-800 px-2 py-1 rounded-full flex items-center justify-center'>
        <p className='capitalize text-sm'>{report.category}</p>
      </div>
    );
  };

  const priorityBodyTemplate = (report) => {
    return (
      <div>
        <PriorityBadge text={report.priority} severity={report.priority} />
      </div>
    );
  };

  const statusBodyTemplate = (report) => {
    return (
      <div>
        <StatusBadge text={report.status} severity={report.status} />
      </div>
    );
  };

  const createdAtBodyTemplate = (report) => {
    return (
      <div>
        <p>{formatDate(report.reportedAt)}</p>
      </div>
    );
  };

  const reportedByBodyTemplate = (report) => {
    return (
      <div className='flex items-center gap-2 justify-center cursor-pointer hover:bg-gray-100/60 transition rounded-full p-2 ' onClick={()=>navigate(`/profile/${report.reportedBy._id}`)}>
        <img src={report.reportedBy.profile_image} alt="" className='w-8 h-8 rounded-full' />
        <p>{report.reportedBy.username}</p>
      </div>
    );
  };

  const actionBodyTemplate = (report) => {
    return (
      <div onClick={(e)=>{
        op.current.toggle(e)
        setSelectedReport(report)
      }}>
        <BsThreeDotsVertical className='p-2 hover:bg-gray-200 transition rounded-full text-3xl cursor-pointer' />
      </div>
    );
  };

  if(loading){
      return <div className='flex justify-center items-center h-[calc(100vh-10rem)]'><Loader/></div>
    }

  return (
    <div>
        <ReportEditModal report={selectedReport} setModalVisible={setModalVisible} modalVisible={modalVisible} getReports={getReports} />
        <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center p-5 bg-white shadow-md mt-5 rounded-lg gap-4'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold'>Manage Reports</h1>
            <p className='text-gray-700'>View and manage all reports</p>
          </div>
          <div>
            <button className='bg-gradient-to-br from-green-500 to-emerald-600 text-white px-4 py-2 rounded-md hover:from-green-600 hover:to-emerald-700 transition duration-300 ease-in-out hover:cursor-pointer flex items-center gap-2'>
              <FiPlusCircle />
              <p>Add New Report</p>
            </button>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row justify-between items-center p-5 bg-white shadow-md mt-5 rounded-lg'>
          <div>
            <form onSubmit={(e)=>{e.preventDefault();handleSearch();}}>
              <IconField iconPosition="left">
                  <InputIcon className="pi pi-search"> </InputIcon>
                  <InputText placeholder="Search Reports" value={search} onChange={(e)=>setSearch(e.target.value)} />
              </IconField>
            </form>
          </div>
          <div>
            <div>
              
            </div>
            <div>
              
            </div>
          </div>
        </div>
        <div className='mt-5 max-w-[calc(100vw-6rem)] lg:max-w-full'>
          <ReportActionOverlay selectedReport={selectedReport} setModalVisible={setModalVisible} getReports={getReports} panelRef={op} />
          <div className='overflow-x-auto'>
            <DataTable value={reports} size="small" sortMode='multiple' removableSort className="min-w-[800px]">
            <Column field='title' header='Title' body={titleBodyTemplate} sortable />
            <Column field='category' header='Category' sortable body={categoryBodyTemplate} />
            <Column field='priority' header='Priority' sortable body={priorityBodyTemplate} />
            <Column field='status' header='Status' sortable body={statusBodyTemplate} />
            <Column field='reportedAt' header='Reported At' sortable body={createdAtBodyTemplate}/>
            <Column field='reportedBy' header='Reported By' sortable body={reportedByBodyTemplate}/>
            <Column header="Action" body={actionBodyTemplate} />
          </DataTable>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row justify-between items-center mt-5 gap-4'>
          <div >
            <p>Page {page} of {totalPages}</p>
          </div>
          <div className='flex gap-3 items-center'>
            <button onClick={()=>setPage(page-1)} disabled={page===1} className='p-2 rounded-full hover:bg-gray-200 transition duration-300 ease-in-out disabled:opacity-50 hover:cursor-pointer'><MdKeyboardArrowLeft /></button>
            {
              Array.from({length:totalPages},(_,i)=>(
                <button key={i} onClick={()=>setPage(i+1)} className={`p-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition duration-300 ease-in-out hover:cursor-pointer ${page===i+1 ? "bg-green-100/90 text-green-700" : ""}`} disabled={page===i+1}>
                  {i+1}
                </button>
              ))
            }
            <button onClick={()=>setPage(page+1)} disabled={page===totalPages} className='p-2 rounded-full hover:bg-gray-200 transition duration-300 ease-in-out disabled:opacity-50 hover:cursor-pointer'><MdKeyboardArrowRight /></button>
          </div>
          <div className='flex gap-3 items-center'>
            <p>Rows per page</p>
            <Dropdown value={limit} options={[2,5,10,15,20]} onChange={(e)=>setLimit(e.value)} />
          </div>
        </div>
    </div>
  )
}

export default ManageReports