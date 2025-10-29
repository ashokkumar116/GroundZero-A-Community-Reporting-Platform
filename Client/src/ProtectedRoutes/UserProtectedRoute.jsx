import { useAuthStore } from "../lib/authStore"
import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({children}) => {
  const {user,loading} = useAuthStore();


  if(loading){
    return <h1>Loading</h1>
  }

  return user ? children : <Navigate to="/login" />

}

export default UserProtectedRoute
