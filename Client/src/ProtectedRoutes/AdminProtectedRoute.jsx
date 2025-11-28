import React from 'react'
import { useAuthStore } from '../lib/authStore'
import Loader from '../Loaders/Loader';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
    const {user,loading } = useAuthStore();

    if(loading){
        return <div className='flex justify-center items-center h-screen'>
            <Loader />
        </div>
    }
    if(!user){
        return <Navigate to="/login" />
    }
    if(!user.isAdmin){
        return <Navigate to="/" />
    }

  return <Outlet />
}

export default AdminProtectedRoute