import { ConfirmPopup } from 'primereact/confirmpopup';
import { OverlayPanel } from 'primereact/overlaypanel'
import React from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom'
import { FiEdit } from 'react-icons/fi';

const ReportActionOverlay = ({panelRef,selectedReport,setModalVisible,getReports}) => {
  const navigate = useNavigate();
  console.log(selectedReport);
  const reportId = selectedReport?._id;
  const handleEdit = () => {
    setModalVisible(true);
  };
  const handleDelete = () => {
    
  }
  return (
    <OverlayPanel ref={panelRef} className='flex flex-col gap-2'>
            <ConfirmPopup />
            <div className='p-2 hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer flex items-center gap-2 rounded-md' onClick={()=>{navigate(`/issues/${reportId}`)}}>
                <HiOutlineExternalLink />
                <p className='text-sm'>View Issue</p>
            </div>
            <div className='p-2 hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer flex items-center gap-2 rounded-md' onClick={handleEdit}>
                <FiEdit/>
                <p className='text-sm'>Edit Report</p>
            </div>
            
        </OverlayPanel>
  )
}

export default ReportActionOverlay