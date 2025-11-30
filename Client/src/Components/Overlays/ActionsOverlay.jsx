import { OverlayPanel } from 'primereact/overlaypanel'
import React from 'react'
import { HiOutlineExternalLink } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../../Services/axios';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';

const ActionsOverlay = ({panelRef,selectedUser,setModalVisible,fetchUser}) => {
    const navigate = useNavigate();
    const userId = selectedUser?.user?._id;

    const handleMakeAdmin = async()=>{
         try{
            const response = await axios.put(`/admin/makeadmin/${userId}`);
            if(response.status === 200){
                toast.success("Admin Added Successfully");
                fetchUser();
                panelRef.current.hide();
            }
         }catch(error){
            toast.error(error?.response?.data?.message);
         }
    }

    const handleRemoveAdmin = async()=>{
        try {
            const response = await axios.put(`/admin/removeadmin/${userId}`);
            if(response.status === 200){
                toast.success("Admin Removed Successfully");
                fetchUser();
                panelRef.current.hide();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    const makeAdminConfirm = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Are you sure you want to make this user an admin?",
            icon: "pi pi-info-circle",
            acceptLabel: "Yes",
            rejectLabel: "No",
            accept: () => handleMakeAdmin(),
            reject: () => panelRef.current.hide()
        })
    }

    const removeAdminConfirm = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Are you sure you want to remove this user as an admin?",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Yes",
            rejectLabel: "No",
            accept: () => handleRemoveAdmin(),
            reject: () => panelRef.current.hide()
        })
    }

  return (
    <OverlayPanel ref={panelRef} className='flex flex-col gap-2'>
        <ConfirmPopup />
        <div className='p-2 hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer flex items-center gap-2 rounded-md' onClick={()=>{navigate(`/profile/${userId}`)}}>
            <HiOutlineExternalLink/>
            <p className='text-sm'>View Profile</p>
        </div>
        <div className='p-2 hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer flex items-center gap-2 rounded-md' onClick={()=>setModalVisible(true)}>
            <FiEdit/>
            <p className='text-sm'>Edit Profile</p>
        </div>
        {
            selectedUser?.isAdmin ? (
                <div className='p-2 hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer flex items-center gap-2 rounded-md' onClick={removeAdminConfirm}>
                    <RiAdminLine/>
                    <p className='text-sm'>Remove Admin</p>
                </div>
            ) : (
                <div className='p-2 hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer flex items-center gap-2 rounded-md' onClick={makeAdminConfirm}>
                    <RiAdminLine/>
                    <p className='text-sm'>Make Admin</p>
                </div>
            )
        }
    </OverlayPanel>
  )
}

export default ActionsOverlay