import Login from "./Pages/Login"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import UserProtectedRoute from "./ProtectedRoutes/UserProtectedRoute";
import { useEffect } from "react";
import { useAuthStore } from "./lib/authStore";

function App() {

  const {verifyAuth,user,loading} = useAuthStore();

  useEffect(()=>{
    verifyAuth();
  },[]);

  if(loading){
    return <div>Loading</div>
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user?<UserProtectedRoute><Home /></UserProtectedRoute>:<Navigate to="/login" />} />
          <Route path="/login" element={user?<Navigate to="/" />:<Login />}/>
          <Route path="/register" element={<Register />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
