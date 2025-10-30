import Login from "./Pages/Login"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import UserProtectedRoute from "./ProtectedRoutes/UserProtectedRoute";
import { useEffect } from "react";
import { useAuthStore } from "./lib/authStore";
import Loader from "./Loaders/Loader";

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user?<Navigate to="/" />:<Login />}/>
          <Route path="/register" element={<Register />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
