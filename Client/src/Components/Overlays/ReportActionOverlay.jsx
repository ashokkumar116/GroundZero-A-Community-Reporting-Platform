import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { OverlayPanel } from 'primereact/overlaypanel'
import React from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom'
import { FiDelete, FiEdit } from 'react-icons/fi';
import { MdDeleteOutline, MdOutlineDelete } from 'react-icons/md';
import axios from '../../Services/axios';
import toast from 'react-hot-toast';

const ReportActionOverlay = ({panelRef,selectedReport,setModalVisible,getReports}) => {
  const navigate = useNavigate();
  console.log(selectedReport);
  const reportId = selectedReport?._id;
  const handleEdit = () => {
    setModalVisible(true);
    panelRef.current.hide();
  };
  const handleDelete = async() => {
    const response = await axios.delete(`/admin/deletereport/${reportId}`);
    if(response.status === 200){
        getReports();
        panelRef.current.hide();
        toast.success("Report Deleted Successfully");
    }
  }

  const removeReportConfirm = (event) => {
          confirmPopup({
              target: event.currentTarget,
              message: "Are you sure you want to remove this report?",
              icon: "pi pi-exclamation-triangle",
              acceptLabel: "Yes",
              rejectLabel: "No",
              accept: () => handleDelete(),
              reject: () => panelRef.current.hide()
          })
      }

  return (
    <OverlayPanel ref={panelRef} className='flex flex-col gap-2'>
            <ConfirmPopup  />
            <div className='p-2 hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer flex items-center gap-2 rounded-md' onClick={()=>{navigate(`/issues/${reportId}`)}}>
                <HiOutlineExternalLink />
                <p className='text-sm'>View Issue</p>
            </div>
            <div className='p-2 hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer flex items-center gap-2 rounded-md' onClick={handleEdit}>
                <FiEdit/>
                <p className='text-sm'>Edit Report</p>
            </div>
            <div className='p-2 hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer flex items-center gap-2 rounded-md' onClick={removeReportConfirm}>
                <MdOutlineDelete />
                <p className='text-sm'>Delete Report</p>
            </div>
            
        </OverlayPanel>
  )
}

export default ReportActionOverlay