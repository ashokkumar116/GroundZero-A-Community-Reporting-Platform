import React, { useState } from 'react'
import {Dialog} from "primereact/dialog"
import { InputTextarea } from 'primereact/InputTextarea';
import { IoSendOutline } from 'react-icons/io5';
import { FiSend } from 'react-icons/fi';
import axios from '../../Services/axios';
import toast from 'react-hot-toast';

const VolunteerRequestModal = ({visible,setVisible,reportId}) => {

    const [note,setNote] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!note){
            toast.error("Please enter a note");
            return;
        }
        try {
            const res = await axios.post(`/request/volunteerrequest/${reportId}`,{note});
            if(res.status === 201){
                toast.success(res.data.message);
            }
            setNote("")
            setVisible(false);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }


  return (
    <Dialog
        visible={visible}
        onHide={()=>setVisible(false)}
        className='w-200'
        header="Confirm Your Volunteering"
        headerStyle={{color:"#19a448" , fontWeight:"bolder"}}
    >
      <form
        className='flex flex-col gap-5'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col gap-2'>
            <label htmlFor="note" className='font-bold'>Tell Us Why You Want to Help</label>
            <InputTextarea rows={4} id='note' placeholder='Write a short note explaining why you want to volunteer…' 
                value={note} onChange={(e)=>setNote(e.target.value)}
            />
        </div>
        <div className='flex justify-end'>
            <button className='flex items-center gap-2 px-5 py-2 bg-gradient-to-br from-green-500 to-teal-800 text-white rounded-lg hover:scale-102 transition cursor-pointer'>
                <FiSend />
                <p>Send Request</p>
            </button>
        </div>
      </form>
    </Dialog>
  )
}

export default VolunteerRequestModal
