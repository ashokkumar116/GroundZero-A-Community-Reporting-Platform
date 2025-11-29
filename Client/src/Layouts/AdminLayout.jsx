import React, { useRef } from 'react'
import { Outlet ,Navigate, useNavigate} from 'react-router-dom'
import { AdminMenuItems } from '../../Contents/constants'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../lib/authStore'
import { BiLogOut } from 'react-icons/bi'
import ProfileOverlayPanel from '../Components/Overlays/ProfileOverlayPanel'


const SideBar = ()=>{

    const navigate = useNavigate();
    return(
        <div className='flex flex-col h-screen gap-6'>
            <div className='flex items-center gap-2 justify-center p-4 border-b border-gray-500/30 cursor-pointer' onClick={()=>navigate('/')}>
                <div>
                    <img src="/icon.png" alt="icon" className='w-10 h-10 bg-green-100 p-1 rounded-md border border-green-500/50' />
                </div>
                <div>
                    <h1 className='text-xl font-bold text-green-800'>GroundZero</h1>
                    <p className='text-xs text-gray-500'>Admin Panel</p>
                </div>
            </div>
            <nav>
                <ul className='flex flex-col gap-2 p-3'>
                    {
                        AdminMenuItems.map((item,index)=>{
                            return <li key={index}>
                                <NavLink to={item.link} className={({isActive})=> `flex items-center gap-2 p-2 rounded-md hover:bg-gray-200/50 ${isActive ? "bg-green-100/90 text-green-700" : ""} transition-all duration-300 ease-in-out`}>
                                    <item.icon/>
                                    <p>{item.name}</p>
                                </NavLink>
                            </li>
                        })
                    }
                </ul>
            </nav>
        </div>
    )
}

const AdminLayout = () => {

    const {user,logout} = useAuthStore()
    const op = useRef(null);

  return (
    <div className='gap-10 bg-gray-50'>
        <ProfileOverlayPanel panelRef={op} userId={user?._id}/>
        <div className='flex'>
            <aside className='w-60 h-screen bg-white fixed top-0 z-60 shadow-lg border-r border-gray-500/30'>
                <SideBar/>
            </aside>
            <main className='flex-1'>
                <div className='flex flex-col gap-10'>
                    <div className='bg-white w-[calc(100%-240px)] fixed left-60 top-0 z-50 shadow-lg flex items-center gap-2 p-2 justify-end'>
                        <div className='flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-200/50 transition-all duration-300 ease-in-out' onClick={(e)=>op.current.toggle(e)}>
                            <div>
                                <img src={user?.profile_image} alt="" className='w-10 h-10 rounded-full' />
                            </div>
                            <div>
                                <p className='font-semibold'>{user?.username}</p>
                                <p className='text-xs text-gray-500'>{user?.email}</p>
                            </div>
                            <div>
                                <button onClick={logout} className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-all duration-300 ease-in-out'>
                                    <BiLogOut />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='pl-70 pt-30 h-screen overflow-y-auto border-b border-gray-500/30'>
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    </div>
  )
}

export default AdminLayout