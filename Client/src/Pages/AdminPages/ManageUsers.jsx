  import { IconField } from 'primereact/iconfield';
  import { InputIcon } from 'primereact/inputicon';
  import { InputText } from 'primereact/inputtext';
  import React, { useRef } from 'react'
  import { useState } from 'react';
  import { FiPlusCircle } from "react-icons/fi";
  import { DataTable } from 'primereact/datatable';
  import axios from '../../Services/axios';
  import { useEffect } from 'react';
  import { Column } from 'primereact/column';
  import { formatDate } from '../../utils/formatDate';
  import { BsThreeDotsVertical } from "react-icons/bs";
  import { Dropdown } from 'primereact/dropdown';
  import { MdKeyboardArrowLeft } from "react-icons/md";
  import { MdKeyboardArrowRight } from "react-icons/md";
import ActionsOverlay from '../../Components/Overlays/ActionsOverlay';
import ProfileEditModal from '../../Components/Modals/ProfileEditModal';
import Loader from '../../Loaders/Loader';


  const ManageUsers = () => {
      const [search, setSearch] = useState('');
      const [users,setUsers] = useState([]);
      const [page,setPage] = useState(1);
      const [totalPages,setTotalPages] = useState(1);
      const [limit,setLimit] = useState(5);
      const [searching,setSearching] = useState(false);
      const [searchMode,setSearchMode] = useState(false);
      const [selectedUser,setSelectedUser] = useState(null);
      const [modalVisible,setModalVisible] = useState(false);
      const [loading,setLoading] = useState(false);

      const op = useRef(null)

      const fetchUsers = async()=>{
        setLoading(true);
        if(searching){
          return;
        }
        const response = await axios.get("/admin/users",{
          params:{
            page,
            limit
          }
        });
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      }

      const fetchSearchUsers = async (pageValue = page) => {
        setLoading(true);
        const response = await axios.get("/admin/searchusers", {
          params: {
            search,
            page: pageValue,
            limit
          }
        });
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      };


      const handleSearch = async()=>{
        setPage(1);
        setSearching(true);
        setSearchMode(true);
        if(!search){
          // fetchUsers();
          setSearching(false);
          setSearchMode(false);
          return;
        }
        fetchSearchUsers();
        setSearching(false);
      }

      useEffect(()=>{
        if(searchMode){
          fetchSearchUsers();
        }else{
          fetchUsers();
        }
      },[page,limit,searchMode])

      const userBody = (rowData)=>{
        return (
          <div className='flex items-center gap-2'>
            <div>
              <img src={rowData.user.profile_image} alt="profile" className='w-10 h-10 rounded-full' />
            </div>
            <div>
              <h1 className='font-semibold text-black'>{rowData.user.username}</h1>
              <p className='text-gray-700 text-sm'>{rowData.user.email}</p>
            </div>
          </div>
        )
      }

      const roleBody = (rowData)=>{
        return (
          <div className={`px-4 py-2 rounded-full flex items-center ${rowData.isAdmin ? "bg-green-100/90 text-green-700" : "bg-gray-100/90 text-gray-700"} inline-flex`}>
            <p className='text-center text-xs'>{rowData.isAdmin ? "Admin" : "User"}</p>
          </div>
        )
      }

      const joinedBody = (rowData)=>{
        return (
          <div>
            {formatDate(rowData.joined)}
          </div>
        )
      }

      const actionBody = (rowData)=>{
        return (
          <div onClick={(e)=>{
            op.current.toggle(e)
            setSelectedUser(rowData)
          }}>
            <BsThreeDotsVertical className='p-2 hover:bg-gray-200 transition rounded-full text-3xl cursor-pointer' />
          </div>
        )
      }

      if(loading){
          return <div className='flex justify-center items-center h-[calc(100vh-10rem)]'><Loader/></div>
        }

    return (
      <div>
        <ProfileEditModal visible={modalVisible} setVisible={setModalVisible} user={selectedUser} fetchUser={fetchUsers}  isAdmin={true}  className=""  />
        <div className='flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-bold'>Manage Users</h1>
            <p className='text-gray-700'>View and manage all registered users</p>
          </div>
          <div>
            <button className='bg-gradient-to-br from-green-500 to-emerald-600 text-white px-4 py-2 rounded-md hover:from-green-600 hover:to-emerald-700 transition duration-300 ease-in-out hover:cursor-pointer flex items-center gap-2'>
              <FiPlusCircle />
              <p>Add New User</p>
            </button>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center p-5 bg-white shadow-md mt-5 rounded-lg gap-4'>
          <div className="w-full lg:w-auto">
            <form onSubmit={(e)=>{e.preventDefault();handleSearch()}}>
              <IconField iconPosition="left" className="w-full">
                  <InputIcon className="pi pi-search"> </InputIcon>
                  <InputText placeholder="Search Users" value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full lg:w-auto" />
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
          <ActionsOverlay panelRef={op} selectedUser={selectedUser} setModalVisible={setModalVisible} fetchUser={fetchUsers} />
          <div className='overflow-x-auto'>
            <DataTable value={users} size="small" sortMode='multiple' removableSort  className="min-w-[800px]" >
            <Column sortable  field='user' header='User' body={userBody} />
            <Column sortable field='isAdmin' header='Role' body={roleBody} />
            <Column sortable field='joined' header='Joined' body={joinedBody} />
            <Column sortable field='postCount' header='Post Count'  />
            <Column sortable field='volunteeredCount' header='Volunteered Count' />
            <Column field='actions' header='Actions' body={actionBody} />
          </DataTable>
          </div>
          <div className='flex flex-col lg:flex-row justify-between items-center mt-5 gap-4'>
            <div >
              <p>Page {page} of {totalPages}</p>
            </div>
            <div className='flex gap-3 items-center overflow-x-auto max-w-full pb-2 lg:pb-0'>
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
              <Dropdown value={limit} options={[5,10,15,20]} onChange={(e)=>setLimit(e.value)} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default ManageUsers