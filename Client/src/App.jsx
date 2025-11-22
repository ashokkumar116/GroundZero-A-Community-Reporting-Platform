import Login from "./Pages/Login"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import UserProtectedRoute from "./ProtectedRoutes/UserProtectedRoute";
import { useEffect } from "react";
import { useAuthStore } from "./lib/authStore";
import Loader from "./Loaders/Loader";
import ExploreIssues from "./Pages/ExploreIssues";
import SingleReport from "./Pages/SingleReport";
import CreateReport from "./Pages/CreateReport";
import Profile from "./Pages/Profile";
import VolunteerWorks from "./Pages/VolunteerWorks";

function App() {

  const {verifyAuth,user,loading} = useAuthStore();

  useEffect(()=>{
    verifyAuth();
  },[]);

  if(loading){
    return <div className="flex justify-center items-center h-screen"><Loader/></div>
  }

  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user?<Navigate to="/" />:<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/issues" element={<ExploreIssues />}/>
          <Route path="/issues/:id" element={<UserProtectedRoute><SingleReport /></UserProtectedRoute>}/>
          <Route path="/create-report" element={<UserProtectedRoute><CreateReport /></UserProtectedRoute>}/>
          <Route path="/profile/:id" element={<UserProtectedRoute><Profile /></UserProtectedRoute>}/>
          <Route path="/volunteer-works/:id" element={<UserProtectedRoute><VolunteerWorks /></UserProtectedRoute>}/>
        </Routes>
    </>
  )
}

export default App
