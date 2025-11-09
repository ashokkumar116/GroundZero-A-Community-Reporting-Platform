import { useAuthStore } from "../lib/authStore";
import { Navigate } from "react-router-dom";
import Loader from "../Loaders/Loader";

const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
};

export default UserProtectedRoute;
